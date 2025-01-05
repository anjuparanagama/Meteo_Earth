<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "weather"; // Replace with your actual database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Sanitize and validate input
    $full_name = trim($_POST['name']);
    $country = trim($_POST['country']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];

    // Basic form validation
    if (empty($full_name) || empty($country) || empty($email) || empty($password)) {
        echo "<script>alert('All fields are required!');</script>";
        exit;
    }

    // Check if email is valid
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "<script>alert('Invalid email format!');</script>";
        exit;
    }

    // Encrypt the password
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    // Prepare and bind the SQL statement to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO users (name, email, country, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $full_name, $email, $country, $hashed_password);

    // Execute the statement
    if ($stmt->execute()) {
        echo "<script>alert('Registration successful!'); window.location.href='reg.html';</script>";
    } else {
        echo "<script>alert('Error: " . $stmt->error . "');</script>";
    }

    // Close the statement and the database connection
    $stmt->close();
    $conn->close();
}
?>
