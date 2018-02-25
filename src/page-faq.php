<?php

$context = Timber::get_context();

$taxonomy = 'faq_categories';
$terms = get_terms( $taxonomy );
$faqs_by_term = array();
foreach( $terms as $term) :
  // query WP to get all FAQs that are associated with the current term
  $query = array(
     'post_type' => 'faq',
     'tax_query' => array(
      array(
       'taxonomy' => $taxonomy,
       'field' => 'slug',
       'terms' => $term->slug
      )
   ));
  $query = new WP_Query( $query );

  // loop through all posts of this term and store the post object in an array
  $posts = array();
  if( $query->have_posts() ):
    while( $query->have_posts() ) : $query->the_post();
      array_push($posts, $post);
    endwhile;
  endif;

  // add the term name and the array of posts to the main array of FAQs by term
  array_push($faqs_by_term, array($term->name, $posts));
endforeach;

$context['faqs'] = $faqs_by_term;

Timber::render('faq.twig', $context);


