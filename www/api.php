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
        return array(
            'strany'   => get_strany_list(),
            'kraje'   => get_kraje_list(),
            'poslanci' => get_poslanci_list(),
        );
    } else {
        return get_poslanec(array_shift($params), $params);
    }
}
function get_strany_list() {
    $result = mysql_query("SELECT * FROM strany");
    $r = array();
    $r[0] = null;
    while($row = mysql_fetch_assoc($result)) {
        $row['id'] = (int)$row['id'];
        $r[$row['id']] = $row;
    }
    return $r;
}
function get_kraje_list() {
    $result = mysql_query("SELECT * FROM kraje");
    $r = array();
    $r[0] = null;
    while($row = mysql_fetch_assoc($result)) {
        $row['id'] = (int)$row['id'];
        $r[$row['id']] = $row;
    }
    return $r;
}
function get_poslanci_list() {
    $result = mysql_query("SELECT * FROM poslanci WHERE poslanec_2010 > 0");
    $r = array();
    while ($row = mysql_fetch_assoc($result)) {
        $row['poslanec_2010']             = (bool)$row['poslanec_2010'];
        $row['id']                        = (int)$row['id'];
        $row['interpelace_target_count']  = (int)$row['interpelace_target_count'];
        $row['interpelace_source_count']  = (int)$row['interpelace_source_count'];
        $row['zakony_predkladatel_count'] = (int)$row['zakony_predkladatel_count'];
        $row['absence_count']             = (int)$row['absence_count'];
        $row['nazor_count']               = (int)$row['nazor_count'];
        $row['vystoupeni_count']          = (int)$row['vystoupeni_count'];
        $row['possible_votes_count']      = (int)$row['possible_votes_count'];
        $row['kraj_id']                   = (int)$row['kraj_id'];
        $row['strana_id']                 = (int)$row['strana_id'];
        $r[] = $row;
    }
    return $r;
}
function get_poslanec($id) {

}
