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
$post = new Timber\Post('blog');
$context['post'] = $post;
$categories = array('Mentor Spotlight', 'Featured Content', 'In The News');
foreach($categories as $category):
  $args = array(
    'category_name' => $category,
    'posts_per_page' => 3
  );
  $query = new WP_Query( $args );
  $posts = array();
  if( $query->have_posts() ):
    while( $query->have_posts() ) : $query->the_post();
      $post = new Timber\Post($post->ID);
      array_push($posts, $post);
    endwhile;
  endif;
  $context["categories"][$category] = $posts;
endforeach;
wp_reset_query();

Timber::render( array( 'blog.twig', 'page.twig' ), $context );
