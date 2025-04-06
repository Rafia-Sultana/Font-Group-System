<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/x-font-ttf");

include 'db.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    
    $sql = "SELECT font_file FROM fonts WHERE id = $id";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $fontPath = $row['font_file'];
        $fullPath = __DIR__ . '/' . $fontPath;
        
        if (file_exists($fullPath)) {
            readfile($fullPath);
            exit;
        }
    }
}

header("HTTP/1.0 404 Not Found");
echo "Font not found";
?>