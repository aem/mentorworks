Chart.defaults.global.defaultFontSize = 12;
Chart.defaults.global.defaultFontFamily =
  '"Roboto", "Helvetica Neue", "Helvetica", "Arial", sans-serif';
Chart.defaults.global.defaultFontColor = '#71808b';

Chart.Tooltip.positioners.custom = function() {
  return {
    x: 0,
    y: 0,
  };
};

// TODO: need to figure out how all the Vue instances interact with one another...

var eventBus = new Vue();

Vue.component('interactive-payments', {
  extends: VueChartJs.Line,
  mixins: [VueChartJs.mixins.reactiveProp],
  props: ['chartData', 'options'],
  mounted: function() {
    // eventBus.$on(
    //   'updateInteractive',
    //   function(e) {
    //     this.update();
    //     // this.refresh();
    //   }.bind(this)
    // );
    this.refresh();
  },
  methods: {
    refresh: function() {
      // TODO: calculate this based on the max points? idk
      this.gradient = this.$refs.canvas
        .getContext('2d')
        .createLinearGradient(0, 100, 0, 600);
      this.gradient.addColorStop(0, '#68d992');
      this.gradient.addColorStop(1, '#419f8e');
      // TODO: does this work?
      this.chartData.datasets[1].backgroundColor = this.gradient;
      this.renderChart(this.chartData, this.options);
    },
  },
});

Vue.component('defer-payments', {
  extends: VueChartJs.Line,
  mixins: [VueChartJs.mixins.reactiveProp],
  props: ['chartData', 'options'],
  mounted: function() {
    // TODO: this fucks everything up...
    // eventBus.$on(
    //   'updateInteractive',
    //   function(e) {
    //     this.refresh();
    //   }.bind(this)
    // );
    this.refresh();
  },
  methods: {
    refresh: function() {
      // TODO: calculate this based on the max points? idk
      this.gradient = this.$refs.canvas
        .getContext('2d')
        .createLinearGradient(0, 0, 0, 300);
      this.gradient.addColorStop(0, '#68d992');
      this.gradient.addColorStop(1, '#419f8e');
      // // TODO: does this work?
      this.chartData.datasets[1].backgroundColor = this.gradient;
      this.renderChart(this.chartData, this.options);
    },
  },
});

Vue.component('monthly-cap', {
  extends: VueChartJs.Line,
  mixins: [VueChartJs.mixins.reactiveProp],
  props: ['chartData', 'options'],
  mounted: function() {
    // TODO: this fucks everything up...
    // eventBus.$on(
    //   'updateInteractive',
    //   function(e) {
    //     this.refresh();
    //   }.bind(this)
    // );
    this.refresh();
  },
  methods: {
    refresh: function() {
      // TODO: calculate this based on the max points? idk
      // this.gradient = this.$refs.canvas
      //   .getContext('2d')
      //   .createLinearGradient(0, 100, 0, 600);
      // this.gradient.addColorStop(0, '#68d992');
      // this.gradient.addColorStop(1, '#419f8e');
      // // TODO: does this work?
      // this.chartData.datasets[1].backgroundColor = this.gradient;
      this.renderChart(this.chartData, this.options);
    },
  },
});

Vue.component('prepayment', {
  extends: VueChartJs.Bar,
  ixins: [VueChartJs.mixins.reactiveProp],
  props: ['chartData', 'options'],
  mounted: function() {
    // TODO: this fucks everything up...
    // eventBus.$on(
    //   'updateInteractive',
    //   function(e) {
    //     this.refresh();
    //   }.bind(this)
    // );
    this.refresh();
  },
  methods: {
    refresh: function() {
      // TODO: calculate this based on the max points? idk
      this.gradient = this.$refs.canvas
        .getContext('2d')
        .createLinearGradient(0, 0, 0, 400);
      this.gradient.addColorStop(0, '#68d992');
      this.gradient.addColorStop(1, '#419f8e');
      // // TODO: does this work?
      this.chartData.datasets[0].backgroundColor = this.gradient;
      this.renderChart(this.chartData, this.options);
    },
  },
});

function formatCurrency(amount, includeCents) {
  return (
    '$' +
    amount
      .toFixed(includeCents ? 2 : 0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  );
}

var vm = new Vue({
  el: '#calculator',
  data: {
    loaded: false,

    isa: {
      rate: '',
      totalCap: '',
      monthlyCap: '',
      obligation: '9 years', // TODO: Number of years... Fixed? Variable? Where to find it?
      incomeThreshold: '',
    },
    loan: {
      payment: '',
      rate: '',
      totalMinimum: '',
    },

    // INTERACTIVE PAYMENTS

    interactivePayments: {
      chartData: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
        ],
        datasets: [
          {
            yAxisID: 'annualSalary',
            label: 'Annual Salary',
            fill: false,
            borderColor: '#f5907a',
            pointBackgroundColor: '#ffffff',
            pointBorderColor: '#f5907a',
            pointBorderWidth: 3,
            pointRadius: 8,
            spanGaps: false,
          },
          {
            yAxisID: 'monthlyPayment',
            label: 'ISA Monthly Payment',
            data: [0, 5, 8, 12, 14, 20, 32],
            fill: 'origin',
            // backgroundColor: this.gradient,
            borderWidth: -1, // TODO: 0 won't hide it....
            pointRadius: 0,
            pointHoverRadius: 0,
            spanGaps: false,
            lineTension: 0,
          },
        ],
      },
      options: {
        // TODO move script to a different file
        // TODO: use this if I want padding around the chart
        // layout: {
        //   padding: {
        //     bottom: 200
        //   }
        // },
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: 'right',
          labels: {
            padding: 40,
            usePointStyle: true,
            fontSize: 16,
          },
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                drawTicks: false,
              },
              ticks: {
                padding: 20,
              },
            },
          ],
          yAxes: [
            {
              display: false,
              id: 'annualSalary',
              type: 'linear',
              position: 'left',
              ticks: {
                beginAtZero: true,
              },
            },
            {
              display: false,
              id: 'monthlyPayment',
              type: 'linear',
              position: 'right',
              ticks: {
                beginsAtZero: true,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItems, data) {
              return (
                '$' +
                tooltipItems.yLabel
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              );
            },
          },
        },
      },
    },
    deferPayments: {
      chartData: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
        ],
        datasets: [
          {
            fill: false,
            pointRadius: 0,
            borderDash: [4],
            borderWidth: 1.5,
            borderColor: '#333333',
            yAxisID: 'thing2',
            data: [25000, 25000, 25000, 25000, 25000, 25000, 25000],
          },
          {
            // TODO: set min an max for this
            yAxisID: 'thing1',
            lineTension: 0.2, // Draw mostly straight lines, not bezier
            pointRadius: 0,
            borderWidth: -1,
            data: [0, 5, 8, 0, 0, 20, 32],
          },
          {
            yAxisID: 'thing2',
            fill: false,
            data: [12000, 12500, 18000, 25000, 32000, 34000, 46000],
            lineTension: 0.2,
            borderWidth: 1.5,
            borderColor: '#f5907a',
            pointRadius: 0,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
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
              id: 'thing1',
              display: false,
              beginAtZero: true,
            },
            {
              id: 'thing2',
              ticks: {
                fontSize: 18,
                min: 0,
                max: 50000,
                // autoSkip: false,
                stepSize: 25000,
                callback: function(value, index, values) {
                  return value === 25000 ? '$25,000' : '';
                  // TODO: don't hardcode this!
                  // return (
                  //   '$' +
                  //   Math.round(value)
                  //     .toString()
                  //     .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  // );
                },
              },
              gridLines: {
                display: false,
              },
            },
            // {
            //   id: 'thing3',
            // },
          ],
        },
      },
    },

    // MONTHLY CAP CHART

    monthlyCapGraph: {
      data: {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
        ],
        datasets: [
          {
            label: 'ISA Monthly Payment',
            data: [0, 5, 8, 12, 14, 20, 32],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    },

    // PREPAYMENT CHART

    prepayment: {
      chartData: {
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
    },
  },
  created: function() {
    var self = this;
    // var url = 'http://calculator.mentorworks.io/calculator/calculate.json'
    // TODO: tell Zhen to add cross-origin header, right now I have a proxy
    var url = 'http://localhost:4000/api/calculator/calculate.json';
    axios
      .post(url, {
        amount: 10000,
        current_salary: 0,
        loan_rate: 11,
        maturity: 9,
        level: 'G',
        major: 59,
      })
      .then(function(res) {
        // Parse the first graph for the monthly ISA payments
        var expectedMonthly = res.data.data.table3_1;
        // Get the years for the labels of the graph
        self.interactivePayments.chartData.labels = expectedMonthly
          .filter(function(row) {
            // Remove the final rows that summarize the data
            return !isNaN(row[0]);
          })
          .map(function(row) {
            return row[0];
          });
        // TODO
        self.interactivePayments.chartData.datasets[0].data = expectedMonthly
          .filter(function(row) {
            // Remove the final rows that summarize the data
            return !isNaN(row[0]);
          })
          .map(function(row) {
            return row[1];
          });
        // TODO
        self.interactivePayments.chartData.datasets[1].data = expectedMonthly
          .filter(function(row) {
            // Remove the final rows that summarize the data
            return !isNaN(row[0]);
          })
          .map(function(row) {
            return row[3];
          });
        // Force update of the graph (reactivity isn't working, unclear why)
        eventBus.$emit('updateInteractive', 3);

        // TODO: for monthly calculator ...

        self.isa.rate = res.data.data.table0.income_share_rate + '%';
        // 'Loan' is mispelled 'load' in the JSON TODO?
        // TODO: should this be rounded or not!?
        // TODO: Change to monthlyPayment up there
        self.isa.totalCap = formatCurrency(
          res.data.data.table0.max_repayment_amount,
          false
        );
        self.isa.monthlyCap = formatCurrency(
          res.data.data.table0.monthly_cap,
          true
        );

        self.loan.payment = formatCurrency(
          res.data.data.table0.load_monthly,
          false
        );
        self.loan.rate = res.data.data.table0.load_rate + '%';
        self.loan.totalMinimum = formatCurrency(
          res.data.data.table0.loan_total_repayment,
          false
        );

        // TODO: show the charts!
        self.loaded = true;
      })
      .catch(function(err) {
        console.error(err);
      });
  },
});
