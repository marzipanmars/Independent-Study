<?php
/* php function for parsing data into a correctly formatted json object */

/* 1. create database connection */
include('database_config.php');
//$data_array = json_decode(file_get_contents('php://input'), true);
try {
  /* using '->' to make non-static function calls for objects */
  $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $password);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  /* 2. perform database query:
  * query() executes an SQL statement, returning a result set as a PDOStatement object */
  $stmt = $conn->query("SELECT `subject_id`, `responses`, `character` FROM `$table_data`");

  /* initialize new array */
  $all_data = array();
  /* fetches the next row from the table set */
  while($row = $stmt->fetch()) { // while there are still rows to be fetched

    if (isset($row['responses'])) {
      /* $reponses saves an associative array instead of an object because
      * true is passed as the second argument */
      $responses = json_decode($row['responses'], true);

      /* create array that contains all necessary keys and values */
      $characters = array('subject_id' => $row['subject_id'],
      'character' => $row['character'],
      'expression' => intval($responses["Q0"]),
      'awareness' => intval($responses["Q1"]),
      'hope' => intval($responses["Q2"]),
      'embarrassment' => intval($responses["Q3"]),
      'empathy' => intval($responses["Q4"]),
      'fear' => intval($responses["Q5"]),
      'hunger' => intval($responses["Q6"]),
      'joy' => intval($responses["Q7"]),
      'memory' => intval($responses["Q8"]),
      'morality' => intval($responses["Q9"]),
      'pain' => intval($responses["Q10"]),
      'personality' => intval($responses["Q11"]),
      'attainment' => intval($responses["Q12"]),
      'pleasure' => intval($responses["Q13"]),
      'pride' => intval($responses["Q14"]),
      'anger' => intval($responses["Q15"]),
      'self-restraint' => intval($responses["Q16"]),
      'thought' => intval($responses["Q17"])
    );

    /* push each $characters array into the $all_data array */
    array_push($all_data, $characters);
  }

}
/* return json object */
$json = json_encode($all_data);
echo $json;

} catch(PDOException $e) {
  $r = array('success' => false, 'error_message' => $e->getMessage());
  echo json_encode($r);
}
/* 3. close database connection */
$conn = null;
?>
