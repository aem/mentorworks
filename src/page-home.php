<?php

$context = Timber::get_context();

$homePageId = 2563; // if ID changes, this will have to be manually updated
$homePage = new TimberPost($homePageId);
$context['homePage'] = $homePage;

Timber::render('home.twig', $context);
