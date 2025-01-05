<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "weather";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$user_id = $_SESSION['user_id'];

// Fetch user information from the database
$query = "SELECT id, name, country FROM users WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // If a user is found
    $row = $result->fetch_assoc();
    $_SESSION['user_name'] = $row['name'];
    $_SESSION['country'] = $row['country'];
} else {
    // no user was found 
    $_SESSION['user_name'] = "Guest";
    $_SESSION['country'] = "Unknown";
}

$stmt->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meteo Earth</title>
    <link rel="stylesheet" href="css/searchstyle.css">
</head>
<body>
    <nav>
        <div class="login">
            <img src="img/log.png" alt="User" class="user-icon">
            <?php if (isset($_SESSION['user_name'])): ?>
                <p id="name" class="login-link">Welcome, <?php echo htmlspecialchars($_SESSION['user_name']); ?>!</p>
            <?php else: ?>
                <p id="name" class="login-link">Registration / Login</p>
            <?php endif; ?>
        </div>
    </nav>

    <main>
        <div class="topic">
            <h1>Meteo Earth<sup>TM</sup></h1>
            <p class="tagline"><b>Your Trusted Weather Details Provider</b></p>
            
            <div class="search">
                <form id="search-form" action="details.html" method="get">
                    <input type="text" placeholder="Enter your location" class="input" id="city-input" name="city" required>
                </form>
            </div>
        </div>
    </main>

    <footer>
        <p><b>Powered By MeteoEarth™ 2024</b></p>
    </footer>
</body>
</html>

<?php
$conn->close();
?>
