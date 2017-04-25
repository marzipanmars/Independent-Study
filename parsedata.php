<?php
// php script for writing survey data into mySQL database
include('database_config.php');
$data_array = json_decode(file_get_contents('php://input'), true);
try {
  // 1. create database connection
  $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  // 2. perform database query
  // First stage is to get all column names from the table and store
  // them in $col_names array.
  $stmt = $conn->prepare("SHOW COLUMNS FROM `$table_data`");
  $stmt->execute();
  $col_names = array();
  while($row = $stmt->fetchColumn()) {
    $col_names[] = $row;
    /*
    $responses = json_decode($row['responses'])
    $responses["Q0"]
    $all_data[] = array('subjectid' => $row['subject_id'], 'morals' => $responses["Q0"])
    $json = json_encode($all_data)
    echo $json
    */
  }
  ?>
