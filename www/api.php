<?php
$config = require('./config.php');
$allowed_methods = array('poslanci');
$request = array();
if(isset($_GET['get'])) {
    $request = explode('/', $_GET['get']);
}
if(in_array($request[0], $allowed_methods)) {
    $method = array_shift($request);
    $method($request);
}
function poslanci($params) {
    if(!count($params)) {
        get_poslanci_list();
    } else {
        get_poslanec(array_shift($params), $params);
    }
}
function get_poslanci_list() {

}
function get_poslanec($id) {

}
mysql_connect($config['db_host'], $config['db_user'], $config['db_pass']);
mysql_select_db($config['db_name']);
