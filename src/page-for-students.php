<?php

$context = Timber::get_context();

$forStudentsPageId = 8; // if ID changes, this will have to be manually updated
$forStudentsPage = new TimberPost($forStudentsPageId);
$context['forStudentsPage'] = $forStudentsPage;

Timber::render('for-students.twig', $context);
