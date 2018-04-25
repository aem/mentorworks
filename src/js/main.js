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

    var $allFaqSections = $('.faq-entry-container');
    $('[faq-section-toggle]').on('click', function() {
      var $parents = $(this).parents('.faq-section');
      $allFaqSections.slideUp();
      $allFaqSections.parents('.faq-section').removeClass('show');
      $parents.find('.faq-entry-container').slideDown();
      $parents.addClass('show');
    });
  });

  $('body').on('click', '.alm-load-more-btn', function() {
    $('.ajax-load-more-wrap').ajaxloadmore();
  });
})(jQuery);

var app = new Vue({
  el: '#header',
  data: {
    showMenu: false,
  },
});
