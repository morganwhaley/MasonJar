<?php
session_start();
require_once("../MasonJar/twitteroauth-master/twitteroauth/twitteroauth.php");

$twitteruser = "supwhaley";
$notweets = 15;
$consumerkey = "oaHwOBkdI5KlszhdsIfwXuoOE";
$consumersecret = "QWXCjidqZIxzwrKbqfdqxPPPI7yzYYG2iUoVvWahYxicZubHp8";
$accesstoken = "247101479-mlnx7LITtXkpbctkXN2pv3cadVPsFRn3QwZHjBmc";
$accesstokensecret = "qctYYfGT85XBfNS9ILXxXXAyiXh2x5H3SjmcUXZKyBD47";

function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}

$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);

$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);

echo json_encode($tweets);
?>