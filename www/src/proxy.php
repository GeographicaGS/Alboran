<?php

$request = $_POST["url"];

$ch = curl_init();
$timeout = 5;
curl_setopt($ch, CURLOPT_URL, $request);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
$response = curl_exec($ch);
curl_close($ch);

print $response;