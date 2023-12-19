<?php
include_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Handle POST data for adding or updating a product
    $category = $_POST['category'];
    $productName = $_POST['productName'];
    $cost = $_POST['cost'];
    $price = $_POST['price'];
    $quantity = $_POST['quantity'];
   
    // Handle Image Upload
    $targetDir = "product-img/";
    $targetFile = $targetDir . basename($_FILES["productImage"]["name"]);
    $imagePath = $targetFile;
    move_uploaded_file($_FILES["productImage"]["tmp_name"], $targetFile);

    if (isset($_POST['productId'])) {
        // Update existing product
        $productId = $_POST['productId'];
        $stmt = $conn->prepare("UPDATE products SET product_name=?, cost=?, price=?, quantity=?, category=? WHERE id=?");
        $stmt->bind_param("ssdssi", $productName, $cost, $price, $quantity, $category, $productId);
    } else {
        // Insert new product
        $stmt = $conn->prepare("INSERT INTO products (product_name, cost, price, quantity, image_path, category) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssdss", $productName, $cost, $price, $quantity, $imagePath, $category);
    }
    // Execute the statement
    $stmt->execute();

    // If it's an insert operation, echo the inserted product ID
    if (!isset($_POST['productId'])) {
        $productId = $conn->insert_id;
        echo $productId;
    }
    // Close the statement
    $stmt->close();
}
$conn->close();
?>