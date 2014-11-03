<?php
session_start();
require_once("../MasonJar/twitteroauth-master/twitteroauth/twitteroauth.php");

$twitteruser = "izze";
$notweets = 15;
$consumerkey = "oO09pLRSGoQugAHBUv3KWWgYK";
$consumersecret = "cKL2s26oAHYq6zZoOsOzEYcXaJqF6o5m6zZSx9CHDr9vY29hMo";
$accesstoken = "22333986-gHg1U4AOoJkAZS7m9AXSdZUig1BIxy3WFhurgP9qN";
$accesstokensecret = "srcL2TCb7ePOrMz5flcN6tGogtMrazLeCSM3SWw1uzehy";

function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}

$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);

$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);

echo json_encode($tweets);
?>