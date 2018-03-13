// ==== CORE ==== //

// A simple wrapper for all your custom jQuery;
// everything in this file will be run on every page
(function($) {
  $(document).ready(function() {
    $('.blog-posts-grid').slick({
      slidesToShow: 3,
      accessibility: false,
    });

    $('[mobile-menu-icon]').on('click', function(e) {
      e.preventDefault();
      $('body').toggleClass('mobile-menu--open');
    });
  });
})(jQuery);
