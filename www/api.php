<?php
$config = require('./config.php');
$allowed_methods = array('poslanci');
$request = array();
mysql_connect($config['db_host'], $config['db_user'], $config['db_pass']);
mysql_select_db($config['db_name']);
mysql_query("SET CHARACTER SET utf8");

if(isset($_GET['get'])) {
    $request = explode('/', $_GET['get']);
}
if(in_array($request[0], $allowed_methods)) {
    $method = array_shift($request);
    $result = $method($request);
    header('Content/type: application/json');
    echo json_encode($result);
}
function poslanci($params) {
    if(!count($params)) {
        return get_poslanci_list();
    } else {
        return get_poslanec(array_shift($params), $params);
    }
}
function get_poslanci_list() {
    $result = mysql_query("SELECT * FROM poslanci");
    $r = array();
    while ($row = mysql_fetch_assoc($result)) {
        $r[] = $row;
    }
    return $r;
}
function get_poslanec($id) {

}
