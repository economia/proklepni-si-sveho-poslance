<?php
$config = require('./config.php');
$allowed_methods = array('poslanci');
$request = array();
mysql_connect($config['db_host'], $config['db_user'], $config['db_pass']);
mysql_select_db($config['db_name']);
mysql_query("SET CHARACTER SET utf8");

if(isset($_GET['get'])) {
    $request = explode('/', $_GET['get']);
} else {
    $result = mysql_query("SELECT id FROM poslanci WHERE poslanec_2010=1");
    while($row = mysql_fetch_assoc($result)) {
        $id = $row['id'];
        file_put_contents("../data/json/$id.json", file_get_contents("http://127.0.0.1/proklepni-si-poslance/www/api.php?get=poslanci/$id"));
    }
    file_put_contents("../data/json/list.json", file_get_contents("http://127.0.0.1/proklepni-si-poslance/www/api.php?get=poslanci"));
    die();
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
        $row['preferencni']               = (bool)$row['preferencni'];
        $row['novacek']                   = (bool)$row['novacek'];
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
        $row['from_date']                 = (int)$row['from_date'];
        $row['to_date']                   = (int)$row['to_date'];
        $r[] = $row;
    }
    return $r;
}
function get_poslanec($id) {
    $id = (int)$id;
    if(!$id) {
        return null;
    }
    return array(
        'zakony'      => get_poslanec_tisky($id),
        'interpelace' => get_poslanec_interpelace($id),
        'vystoupeni'  => get_poslanec_vystoupeni($id),
        'hlasovani' => get_poslanec_hlasovani($id)
    );
}

function get_poslanec_tisky($id) {
    $result = mysql_query("SELECT tisky.id, tisky.cislo_tisku, tisky.cislo_za, tisky.predlozeno AS datum, tisky.nazev
        FROM tisky JOIN predkladatele ON (tisky.id=predkladatele.tisk_id)
        WHERE predkladatele.osoba_id=$id AND predlozeno>1275350400
        ORDER BY predlozeno");
    $r = array();
    while($row = mysql_fetch_assoc($result)) {
        $row['id'] = (int)$row['id'];
        $row['datum'] = (int)$row['datum'];
        $r[] = $row;
    }
    return $r;
}
function get_poslanec_interpelace($id) {
    $result = mysql_query("SELECT interpelace.id, interpelace.ministr_id, interpelace.vec, interpelace_losovani.datum
        FROM interpelace JOIN interpelace_losovani ON (interpelace.losovani_id=interpelace_losovani.id)
        WHERE interpelace.poslanec_id=$id AND interpelace_losovani.datum>1275350400
        ORDER BY interpelace_losovani.datum ASC");
    $r = array();
    while($row = mysql_fetch_assoc($result)) {
        $row['id']    = (int)$row['id'];
        $row['ministr_id']    = (int)$row['ministr_id'];
        $row['datum'] = (int)$row['datum'];
        $r[] = $row;
    }
    return $r;
}
function get_poslanec_vystoupeni($id) {
    $result = mysql_query("SELECT datum, url FROM poslanci_vystoupeni WHERE poslanec_id=$id ORDER BY datum ASC");
    $r = array();
    while($row = mysql_fetch_assoc($result)) {
        $row['datum'] = (int)$row['datum'];
        $r[] = $row;
    }
    return $r;
}
function get_poslanec_hlasovani($id) {
    $result = mysql_query("SELECT hlasovani.id, hlasovani.nazev, hlasovani.datum, hlasovani_poslanec.vysledek FROM hlasovani
        JOIN hlasovani_poslanec ON (hlasovani.id=hlasovani_poslanec.hlasovani_id)
        JOIN poslanci_hlas_pseudoid ON (poslanci_hlas_pseudoid.poslanec_hlas_id = hlasovani_poslanec.poslanec_id)
        WHERE hlasovani.bod>0 AND poslanci_hlas_pseudoid.poslanec_id=$id AND datum>0
        ORDER BY datum ASC");
    $r = array();
    while($row = mysql_fetch_assoc($result)) {
        $row['datum'] = (int)$row['datum'];
        $row['id'] = (int)$row['id'];
        $r[] = $row;
    }
    return $r;
}
