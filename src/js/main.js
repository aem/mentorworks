// ==== CORE ==== //

// A simple wrapper for all your custom jQuery;
// everything in this file will be run on every page
(function($) {
  // TODO: can we replace this with Vue? idk
  $(document).ready(function() {
    $('.blog-posts-grid').slick({
      slidesToShow: 3,
      accessibility: false,
    });
    $('.testimonials-slider').slick({
      slidesToShow: 1,
      accessibility: false,
      dots: true,
      infinite: true,
    });
  });
})(jQuery);

var app = new Vue({
  el: '#app',
  data: {
    showMenu: false,
  },
});
