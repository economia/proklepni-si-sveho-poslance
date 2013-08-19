<?php
$config = require('./config.php');
mysql_connect($config['db_host'], $config['db_user'], $config['db_pass']);
mysql_select_db($config['db_name']);
