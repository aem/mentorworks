<?php

if ( ! class_exists( 'Timber' ) ) {
	add_action( 'admin_notices', function() {
			echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
		} );
	return;
}

Timber::$dirname = array('templates', 'views');

class MentorWorksSite extends TimberSite {

	function __construct() {
		add_theme_support( 'post-formats' );
		add_theme_support( 'post-thumbnails' );
		add_theme_support( 'menus' );
		add_filter( 'timber_context', array( $this, 'add_to_context' ) );
		add_filter( 'get_twig', array( $this, 'add_to_twig' ) );
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ) );
		parent::__construct();
	}

	function register_post_types() {
	  register_post_type('faq',
	    array(
	      'labels' => array(
	        'name' => __('FAQs'),
	        'singular_name' => __('FAQ')
	      ),
	      'public' => false,
	      'show_ui' => true
	    )
	  );
	}

	function register_taxonomies() {
		register_taxonomy('faq_categories', array('faq'), array(
	    'labels'                => array(
        'name'                       => __('FAQ Categories'),
        'separate_items_with_commas' => __('Separate FAQ categories with commas'),
        'choose_from_most_used'      => __('Choose from the most used FAQ categories'),
	    ),
	    'hierarchical' => false,
	    'show_admin_column' => true
		));
		register_taxonomy_for_object_type('faq_categories', 'faq');
	}

	function add_to_context( $context ) {
		$context['header_menu'] = new TimberMenu('Header Menu');
		$context['footer_menu'] = new TimberMenu('Footer Menu');
		$context['site'] = $this;
		return $context;
	}

	function add_to_twig( $twig ) {
		/* this is where you can add your own fuctions to twig */
		$twig->addExtension( new Twig_Extension_StringLoader() );
		$twig->addFilter( 'myfoo', new Twig_Filter_Function( 'myfoo' ) );
		return $twig;
	}

}

new MentorWorksSite();

function myfoo( $text ) {
	$text .= ' bar!';
	return $text;
}

/* Show the Options from Advanced Custom Fields in the Admin sidebar */
function add_advanced_custom_fields_options_page() {
	if( function_exists('acf_add_options_page') ) {
	   acf_add_options_page();
	}
}
