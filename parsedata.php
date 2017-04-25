<?php

function parse_data() {
// php function for parsing data into a correctly formatted json object
include('database_config.php');
$data_array = json_decode(file_get_contents('php://input'), true);
try {
  // 1. create database connection
  $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  // 2. perform database query
  // First stage is to get all column names from the table and store
  // them in $col_names array.
  $stmt = $conn->query("SELECT subject_id, responses, character FROM `$table_data`");
  //$stmt->execute();
  //$col_names = array();
  /* fetches the next row from the table set */
  while($row = $stmt->fetch()) { /* while there're still rows to be fetched */
    //$col_names[] = $row;

    /* $reponses saves an associative array */
    $responses = json_decode($row['responses'], true);
    $all_data[] = array('subjectid' => $row['subject_id'],
                        'character' => $row['character'],
                        'expression' => intval($responses["Q0"]),
                        'awareness' => intval($responses["Q1"]),
                        'hope' => intval($responses["Q2"]),
                        'embarrassment' => intval($responses["Q3"]),
                        'empathy' => intval($responses["Q4"]));
    $json = json_encode($all_data)
    return $json
  }

} catch(PDOException $e) {
  $r = array('success' => false, 'error_message' => $e->getMessage());
  echo json_encode($r);
}
$conn = null;
}
?>
