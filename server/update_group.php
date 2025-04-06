<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"]) || !isset($data["group_name"]) || !isset($data["font_ids"]) || count($data["font_ids"]) < 2) {
    echo json_encode(["success" => false, "message" => "Invalid data. Group ID, name and at least two fonts are required."]);
    exit();
}

$id = $data["id"];
$groupName = $data["group_name"];
$fontIds = json_encode($data["font_ids"]);

$stmt = $conn->prepare("UPDATE font_groups SET group_name = ?, font_ids = ? WHERE id = ?");
$stmt->bind_param("ssi", $groupName, $fontIds, $id);
$result = $stmt->execute();

if ($result) {
    echo json_encode(["success" => true, "message" => "Font group updated successfully!"]);
} else {
    echo json_encode(["success" => false, "message" => "Database Error: " . $conn->error]);
}
?>