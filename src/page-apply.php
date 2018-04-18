<?php
$post = new TimberPost();
$context = Timber::get_context();
$context['post'] = $post;
Timber::render('apply.twig', $context);
