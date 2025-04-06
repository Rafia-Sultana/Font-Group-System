<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "font_manager";

// Create Connection
$conn = new mysqli($host, $user, $password, $database);

// Check Connection
if ($conn->connect_error) {
    die("Database Connection Failed: " . $conn->connect_error);
}
?>
