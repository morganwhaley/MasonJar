<?php
session_start();
require_once("twitteroauth-master/twitteroauth/twitteroauth.php");

$twitteruser = "your_username";
$notweets = 8;
$consumerkey = "your_consumer_key";
$consumersecret = "your_consumer_secret";
$accesstoken = "your_access_token";
$accesstokensecret = "your_access_token_secret";

function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}

$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);

$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);

echo json_encode($tweets);
?>