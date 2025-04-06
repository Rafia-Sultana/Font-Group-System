<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

include 'db.php';

$sql = "SELECT * FROM fonts ORDER BY uploaded_at DESC";
$result = $conn->query($sql);

$fonts = [];
while ($row = $result->fetch_assoc()) {
    $fonts[] = $row;
}

echo json_encode($fonts);
?>
