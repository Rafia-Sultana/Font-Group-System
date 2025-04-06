<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['id'])) {
    $id = $_POST['id'];

    $sql = "DELETE FROM font_groups WHERE id = $id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Font group deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Database Error: " . $conn->error]);
    }
}
?>