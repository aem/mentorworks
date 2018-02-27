<?php
/**
 * The main template file
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 0.1
 */

if ( ! class_exists( 'Timber' ) ) {
	echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
	return;
}
$context = Timber::get_context();
$context['posts'] = Timber::get_posts();

$args = array(
  'category_name' => 'Featured',
  'posts_per_page' => 1
);
$query = new WP_Query( $args );
if( $query->have_posts() ):
  while( $query->have_posts() ) : $query->the_post();
    $context['featuredPost'] = $post;
  endwhile;
endif;

$args = array(
  'category_name' => 'Spotlights'
);
$query = new WP_Query( $args );
$posts = array();
if( $query->have_posts() ):
  while( $query->have_posts() ) : $query->the_post();
    array_push($posts, $post);
  endwhile;
endif;
$context['spotlightPosts'] = $posts;

$args = array(
  'posts_per_page' => -1
);
$query = new WP_Query( $args );
$posts = array();
if( $query->have_posts() ):
  while( $query->have_posts() ) : $query->the_post();
    array_push($posts, $post);
  endwhile;
endif;
$context['ourArticles'] = $posts;

$args = array(
  'category_name' => 'Spotlights' // this needs to change when we have some posts to the real category
);
$query = new WP_Query( $args );
$posts = array();
if( $query->have_posts() ):
  while( $query->have_posts() ) : $query->the_post();
    array_push($posts, $post);
  endwhile;
endif;
$context['inTheNewsPosts'] = $posts;

$templates = array( 'index.twig' );
if ( is_home() ) {
	array_unshift( $templates, 'index.twig' );
} else if( is_front_page() ) {
  array_unshift( $templates, 'home.twig' );
}
Timber::render( $templates, $context );
