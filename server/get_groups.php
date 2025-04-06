<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'db.php';

$sql = "SELECT * FROM font_groups ORDER BY id DESC";
$result = $conn->query($sql);

$groups = [];
while ($row = $result->fetch_assoc()) {
    $groups[] = $row;
}

echo json_encode($groups);
?>