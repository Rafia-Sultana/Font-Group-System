<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization"); 


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['font'])) {
    $file_name = $_FILES['font']['name'];
    $file_tmp = $_FILES['font']['tmp_name'];
    $file_ext = pathinfo($file_name, PATHINFO_EXTENSION);

    if ($file_ext !== 'ttf') {
        echo json_encode(["success" => false, "message" => "Only TTF files are allowed."]);
        exit;
    }


    $check_sql = "SELECT * FROM fonts WHERE font_name = '$file_name'";
    $result = $conn->query($check_sql);
    
    if ($result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "A font with this name already exists. Please rename the file or upload a different font."]);
        exit;
    }

    $target_dir = "uploads/";
    if (!file_exists($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    $target_file = $target_dir . basename($file_name);

    if (move_uploaded_file($file_tmp, $target_file)) {
        $sql = "INSERT INTO fonts (font_name, font_file) VALUES ('$file_name', '$target_file')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "Font uploaded successfully.", "font" => $file_name]);
        } else {
            echo json_encode(["success" => false, "message" => "Database Error: " . $conn->error]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "File upload failed."]);
    }
}
?>

