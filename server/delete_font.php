<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

// Log all incoming data for debugging
$log_file = fopen("delete_log.txt", "a");
fwrite($log_file, "Request Method: " . $_SERVER['REQUEST_METHOD'] . "\n");
fwrite($log_file, "POST data: " . print_r($_POST, true) . "\n");
fwrite($log_file, "Raw input: " . file_get_contents("php://input") . "\n\n");
fclose($log_file);

// Get the raw POST data
$rawData = file_get_contents("php://input");

// First try to parse as JSON
$jsonData = json_decode($rawData, true);
if (isset($jsonData['id'])) {
  $id = $jsonData['id'];
} 
// Then try to get from POST
else if (isset($_POST['id'])) {
  $id = $_POST['id'];
} 
// Finally try to parse as URL encoded
else {
  parse_str($rawData, $postData);
  $id = isset($postData['id']) ? $postData['id'] : null;
}

if ($id) {
  // First get the font file path
  $query = "SELECT font_file FROM fonts WHERE id = $id";
  $result = $conn->query($query);
  
  if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $font_file = $row['font_file'];
    
    // Now delete from database
    $sql = "DELETE FROM fonts WHERE id = $id";
    if ($conn->query($sql) === TRUE) {
      // Clean up font groups that reference this font
      include_once 'clean_groups.php';
      cleanGroupsAfterFontDeletion($id, $conn);
      
      // Try to delete the file
      if (file_exists($font_file)) {
        if (unlink($font_file)) {
          echo json_encode(["success" => true, "message" => "Font deleted successfully with file."]);
        } else {
          echo json_encode(["success" => true, "message" => "Font deleted from database but file could not be removed."]);
        }
      } else {
        echo json_encode(["success" => true, "message" => "Font deleted successfully from database."]);
      }
    } else {
      echo json_encode(["success" => false, "message" => "Database Error: " . $conn->error]);
    }
  } else {
    echo json_encode(["success" => false, "message" => "Font not found."]);
  }
} else {
  echo json_encode(["success" => false, "message" => "No ID provided."]);
}
?>

