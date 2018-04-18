<?php
$post = new TimberPost();
$context = Timber::get_context();
$context['post'] = $post;
$context['recent_blog_posts'] = Timber::get_posts(array(
  'posts_per_page' => 3
));

Timber::render('apply.twig', $context);
