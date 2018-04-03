<?php
/**
 * The Template for displaying all single posts
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::get_context();
$post = Timber::query_post();
$context['post'] = $post;

// Query related posts for bottom of article
$args = array(
	'post__not_in' => array($post->ID), // Exclude current post
	'category_name' => $post->category,
	'posts_per_page'=> 3, // Limit to 3 posts
	'no_found_rows' => True // Optimize the query
);
$query = new WP_Query( $args );
$posts = array();
if( $query->have_posts() ):
	while( $query->have_posts() ) : $query->the_post();
		array_push($posts, new Timber\Post($post->ID));
  endwhile;
endif;
$context['relatedPosts'] = $posts;

if ( post_password_required( $post->ID ) ) {
	Timber::render( 'single-password.twig', $context );
} else {
	Timber::render( array( 'single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig' ), $context );
}
