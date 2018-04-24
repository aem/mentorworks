// Set sensible styles for all charts
Chart.defaults.global.defaultFontSize = 12;
Chart.defaults.global.defaultFontFamily =
  '"Roboto", "Helvetica Neue", "Helvetica", "Arial", sans-serif';
Chart.defaults.global.defaultFontColor = '#71808b';

// Create data structure shared across components
var store = {
  // Are the graphs ready to display/has the calculator data loaded?
  loaded: false,
  // ISA statistics
  isa: {
    rate: '',
    totalCap: '',
    monthlyCap: '',
    obligation: '9 years', // TODO: Is this fixed? Variable? From API?
    incomeThreshold: '',
  },
  // Loan statistics
  loan: {
    payment: '',
    rate: '',
    totalMinimum: '',
  },
  // Array of years to graph
  labels: [],
  // Interactive graph
  expectedSalary: [],
  expectedMonthlyPayments: [],
  // Tooltip/hover data for interactive graph
  interactive: {
    activeDrag: false,
    showTooltip: false,
    hoverSalary: '',
    hoverPayment: '',
  },
};

// Utility functions

function formatCurrency(amount, decimalPlaces) {
  return (
    '$' +
    amount
      .toFixed(decimalPlaces)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  );
}

function calculatePayment(salary) {
  // If the income drops below the floor, no monthly payments
  // Otherwise, pay at ISA rate of income (per month)
  // Also have the max be the monthly cap
  return salary < 25000
    ? 0
    : Math.min(Math.max(0, 0.0221 * salary / 12), store.isa.monthlyCap);
}

// Add global Vue filter
Vue.filter('formatCurrency', formatCurrency);

// Interactive Monthly ISA Payment graph
Vue.component('interactive-payments', {
  extends: VueChartJs.Line,
  mixins: [VueChartJs.mixins.reactiveProp],
  props: ['chartData'],
  mounted: function() {
    // TODO: calculate this based on the max points and height? create helper!
    this.gradient = this.$refs.canvas
      .getContext('2d')
      .createLinearGradient(0, 200, 0, 400);
    this.gradient.addColorStop(0, '#68d992');
    this.gradient.addColorStop(1, '#419f8e');
    this.data.datasets[1].backgroundColor = this.gradient;
    // Render the actual chart
    this.renderChart(this.data, this.options);
  },
  data: function() {
    return {
      // Include the global Vue.js store
      store: store,
      data: {
        labels: store.labels,
        datasets: [
          {
            yAxisID: 'annualSalary',
            label: 'Annual Salary',
            fill: false,
            borderColor: '#f5907a',
            data: store.expectedSalary,
            // Normal point styles
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#f5907a',
            pointBorderWidth: 3,
            pointRadius: 8,
            // Hover styles
            pointHoverBackgroundColor: '#ffffff',
            pointHoverBorderColor: '#f5907a',
            pointHoverBorderWidth: 3,
            pointHoverRadius: 8,
            spanGaps: false,
            lineTension: 0,
          },
          {
            yAxisID: 'monthlyPayment',
            label: 'ISA Monthly Payment',
            data: store.expectedMonthlyPayments,
            fill: 'origin',
            borderWidth: -1,
            pointRadius: 0,
            pointHoverRadius: 0,
            spanGaps: false,
            lineTension: 0.2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onHover: function(e, active) {
          // Let the drag handler take care of updating
          if (!this.store.interactive.activeDrag) {
            if (active.length > 0) {
              // Just use the index of the first active element... that's probably right
              this.store.interactive.hoverSalary = formatCurrency(
                this.data.datasets[0].data[active[0]._index],
                2
              );
              this.store.interactive.hoverPayment = formatCurrency(
                this.data.datasets[1].data[active[0]._index],
                2
              );
              this.store.interactive.showTooltip = true;
            } else {
              this.store.interactive.showTooltip = false;
            }
          }
        }.bind(this),
        layout: { padding: { top: 10 } },
        // Drag events and changes
        dragData: true,
        onDragStart: function(e) {
          // Add top padding so points at the max don't get cut off
          // Change cursor to 'move'
          this.$refs.canvas.style.cursor = 'move';
          this.store.interactive.activeDrag = true;
        }.bind(this),
        onDrag: function(e, datasetIndex, index, value) {
          var dataset = this.data.datasets[datasetIndex];
          // Touch events don't work well... (value is undefined!)
          if (e.type === 'touchmove') {
            return dataset.data[index];
          }
          // Enforce max/mins in the graph (coerce the value for the Chart.js plugin)
          var yAxis = this.options.scales.yAxes.find(
            function(el) {
              return el.id === dataset.yAxisID;
            }.bind(this)
          ).ticks;
          var salary = Math.min(yAxis.max, Math.max(yAxis.min, value));
          // TODO: remove the rate and floor from being hardcoded
          // TODO: add monthly cap
          var payment = calculatePayment(salary);
          // Update the monthly payment in tandem with salary
          this.data.datasets[1].data.splice(index, 1, payment);
          // Fill drag point orange
          dataset.pointBackgroundColor = dataset.data.map(function(val, i) {
            return i == index ? '#f5907a' : '#ffffff';
          });
          // Update the tooltip
          this.store.interactive.showTooltip = true;
          this.store.interactive.hoverSalary = formatCurrency(salary, 2);
          this.store.interactive.hoverPayment = formatCurrency(payment, 2);
          // Tell the Chart.js draggable plugin what the new value should be
          return salary;
        }.bind(this),
        onDragEnd: function(e, datasetIndex, index, value) {
          // Change cursor back to default (non move)
          this.$refs.canvas.style.cursor = 'initial';
          // TODO Change all the point back to a white background
          var dataset = this.data.datasets[datasetIndex];
          dataset.pointBackgroundColor = dataset.data.map(function() {
            return '#ffffff';
          });
          this.store.interactive.activeDrag = false;
        }.bind(this),
        scales: {
          xAxes: [{ gridLines: { drawTicks: false }, ticks: { padding: 20 } }],
          yAxes: [
            {
              display: false,
              id: 'annualSalary',
              ticks: {
                min: 0,
                // Scale the graph so the max value is only ~75% of the axis
                max: 1.3 * Math.max.apply(null, store.expectedSalary),
                beginAtZero: true,
              },
            },
            {
              display: false,
              id: 'monthlyPayment',
              ticks: {
                min: 0, // Scale the graph so the max value is only half of the axis
                max: 3 * Math.max.apply(null, store.expectedMonthlyPayments),
                beginsAtZero: true,
              },
            },
          ],
        },
        legend: { display: false },
        tooltips: { enabled: false },
      },
    };
  },
});

Vue.component('defer-payments', {
  extends: VueChartJs.Line,
  mixins: [VueChartJs.mixins.reactiveProp],
  props: ['chartData'],
  mounted: function() {
    // TODO: calculate this based on the max points? idk
    this.gradient = this.$refs.canvas
      .getContext('2d')
      .createLinearGradient(0, 150, 0, 300);
    this.gradient.addColorStop(0, '#68d992');
    this.gradient.addColorStop(1, '#419f8e');
    // // TODO: does this work?
    this.data.datasets[1].backgroundColor = this.gradient;
    this.renderChart(this.data, this.options);
  },
  data: function() {
    // Arbitrary data to simply illustrate you don't make paymetns for less than 25k
    var exampleSalary = [
      12000,
      13000,
      16000,
      21000,
      25000,
      27000,
      31000,
      36000,
      40000,
    ];
    var examplePayment = exampleSalary.map(calculatePayment);
    return {
      store: store,
      data: {
        labels: store.labels,
        datasets: [
          {
            fill: false,
            pointRadius: 0,
            borderDash: [4],
            borderWidth: 2,
            borderColor: '#333333',
            yAxisID: 'annualSalary',
            data: store.labels.map(function() {
              return 25000; // TODO: change to some other value
            }),
          },
          {
            // TODO: set min an max for this (in options)
            yAxisID: 'monthlyPayment',
            lineTension: 0.2,
            pointRadius: 0,
            borderWidth: -1, // Oddly, 0 shows a border radius
            data: examplePayment, // TODO
          },
          {
            yAxisID: 'annualSalary',
            fill: false,
            data: exampleSalary,
            lineTension: 0.2,
            borderWidth: 2,
            borderColor: '#f5907a',
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                color: '#b5b9be',
                lineWidth: 0.5,
                drawTicks: false,
              },
              ticks: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              id: 'monthlyPayment',
              display: false,
              ticks: {
                min: 0,
                // Scale the graph so the max value is only 1/2 of the axis
                max: 2 * Math.max.apply(null, examplePayment),
                beginAtZero: true,
              },
            },
            {
              id: 'annualSalary',
              ticks: {
                // TODO: don't hardcode this!
                fontSize: 14,
                min: 0,
                max: 50000,
                stepSize: 25000,
                callback: function(value, index, values) {
                  return value === 25000 ? '$25,000' : '';
                },
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
    };
  },
});

Vue.component('monthly-cap', {
  extends: VueChartJs.Line,
  mixins: [VueChartJs.mixins.reactiveProp],
  props: ['chartData'],
  mounted: function() {
    // TODO: calculate this based on the max points? idk
    this.gradient = this.$refs.canvas
      .getContext('2d')
      .createLinearGradient(0, 150, 0, 300);
    this.gradient.addColorStop(0, '#68d992');
    this.gradient.addColorStop(1, '#419f8e');
    // // TODO: does this work?
    this.data.datasets[2].backgroundColor = this.gradient;
    this.renderChart(this.data, this.options);
  },
  data: function() {
    // Salary at which you hit the cap
    var greatSalary = 12 * store.isa.monthlyCap * (100 / store.isa.rate);
    console.log(store.isa.monthlyCap);
    console.log(store.isa.rate);
    console.log(greatSalary);
    // Arbitrary data to simply illustrate the monthly cap
    var exampleSalary = [
      greatSalary * 0.65,
      greatSalary * 0.7,
      greatSalary * 0.83,
      greatSalary * 0.9,
      greatSalary,
      greatSalary * 1.1,
      greatSalary * 1.2,
      greatSalary * 1.4,
      greatSalary * 1.65,
    ];
    var examplePayment = exampleSalary.map(calculatePayment);
    return {
      store: store,
      data: {
        // Since no labels are exposed, that doesn't matter
        labels: exampleSalary,
        datasets: [
          {
            yAxisID: 'monthlyPayment',
            fill: false,
            pointRadius: 0,
            borderDash: [4],
            borderWidth: 2,
            borderColor: '#333333',
            data: exampleSalary.map(function() {
              return store.isa.monthlyCap;
            }),
          },
          {
            yAxisID: 'annualSalary',
            fill: false,
            data: exampleSalary,
            lineTension: 0.2,
            borderWidth: 2,
            borderColor: '#f5907a',
            pointRadius: 0,
          },
          {
            // TODO: set min an max for this (in options)
            yAxisID: 'monthlyPayment',
            lineTension: 0.2,
            pointRadius: 0,
            borderWidth: -1, // Oddly, 0 shows a border radius
            data: examplePayment, // TODO
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                color: '#b5b9be',
                lineWidth: 0.5,
                drawTicks: false,
              },
              ticks: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              id: 'annualSalary',
              display: false,
              ticks: {
                min: -1 * Math.min.apply(null, exampleSalary),
                // Scale the graph so the max value is only 1/2 of the axis
                max: Math.max.apply(null, exampleSalary),
              },
            },
            {
              id: 'monthlyPayment',
              ticks: {
                fontSize: 14,
                min: 0,
                max: 2 * store.isa.monthlyCap,
                stepSize: store.isa.monthlyCap,
                callback: function(value, index, values) {
                  return value === Math.round(store.isa.monthlyCap)
                    ? formatCurrency(store.isa.monthlyCap, 2)
                    : '';
                },
                beginsAtZero: true,
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
    };
  },
});

Vue.component('prepayment', {
  extends: VueChartJs.Bar,
  mixins: [VueChartJs.mixins.reactiveProp],
  props: ['chartData'],
  mounted: function() {
    // TODO: calculate this based on the max points? idk
    this.gradient = this.$refs.canvas
      .getContext('2d')
      .createLinearGradient(0, 0, 0, 400);
    this.gradient.addColorStop(0, '#68d992');
    this.gradient.addColorStop(1, '#419f8e');
    // TODO: does this work?
    this.data.datasets[0].backgroundColor = this.gradient;
    this.renderChart(this.data, this.options);
  },
  data: function() {
    return {
      data: {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: 'MentorWorks',
            data: [0, 5, 8, 12, 14, 20, 32],
          },
          {
            label: 'Loan?',
            data: [17, 3, 7, 8, 0, 12, 13, 4],
            backgroundColor: 'rgba(113, 128, 139, 0.3)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        categoryPercentage: 0.1,
        barPercentage: 0.1,
        tooltips: {
          enabled: false,
        },
        legend: {
          display: false,
        },
      },
    };
  },
});

var vm = new Vue({
  el: '#calculator',
  data: store,
  created: function() {
    // var url = 'http://calculator.mentorworks.io/calculator/calculate.json'
    // TODO: tell Zhen to add cross-origin header, right now I have a proxy
    var url = 'http://localhost:4000/api/calculator/calculate.json';
    // TODO: do this based on URL parameters
    axios
      .post(url, {
        amount: 10000,
        current_salary: 0,
        loan_rate: 11,
        maturity: 9,
        level: 'G',
        major: 59,
      })
      .then(
        function(res) {
          var overview = res.data.data.table0;
          var expected = res.data.data.table3_1;
          // Parse data for the heading ISA/loan comparison
          // TODO: I need raw data, can't use percentage here
          this.isa.rate = overview.income_share_rate;
          // 'Loan' is mispelled 'load' in the JSON
          this.isa.totalCap = overview.max_repayment_amount;
          this.isa.monthlyCap = overview.monthly_cap;
          this.loan.payment = overview.load_monthly;
          this.loan.rate = overview.load_rate + '%';
          this.loan.totalMinimum = overview.loan_total_repayment;
          // Get the years for the labels of the graph
          this.labels = expected
            .filter(function(row) {
              // Remove the final rows that summarize the data
              return !isNaN(row[0]);
            })
            .map(function(row) {
              return row[0];
            });
          // TODO
          this.expectedSalary = expected
            .filter(function(row) {
              // Remove the final rows that summarize the data
              return !isNaN(row[0]);
            })
            .map(function(row) {
              return row[1];
            });
          // TODO
          this.expectedMonthlyPayments = expected
            .filter(function(row) {
              // Remove the final rows that summarize the data
              return !isNaN(row[0]);
            })
            .map(function(row) {
              return row[3];
            });
          // Show all the charts!
          this.loaded = true;
        }.bind(this)
      )
      .catch(function(err) {
        console.error(err);
      });
  },
});
