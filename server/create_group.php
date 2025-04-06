<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["group_name"]) || !isset($data["font_ids"]) || count($data["font_ids"]) < 2) {
    echo json_encode(["error" => "At least two fonts are required."]);
    exit();
}

$groupName = $data["group_name"];
$fontIds = json_encode($data["font_ids"]);

$stmt = $conn->prepare("INSERT INTO font_groups (group_name, font_ids) VALUES (?, ?)");
$stmt->bind_param("ss", $groupName, $fontIds);
$stmt->execute();

echo json_encode(["success" => "Font group created!"]);
?>
