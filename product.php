<?php
header('Content-Type: application/json');
include_once 'config.php';

if($_SERVER['REQUEST_METHOD'] == 'GET'){
    // Fetch products from the database
    $sql = "SELECT id, product_name, cost, price, quantity, image_path, category FROM products";
    $result = $conn->query($sql);

    if($result->num_rows > 0){
        $products = array();

        while($row = $result->fetch_assoc()){
            $products[] = array(
                'id' => $row['id'],
                'product_name' => $row['product_name'],
                'cost' => $row['cost'],
                'price' => $row['price'],
                'quantity' => $row['quantity'],
                'image_path' => $row['image_path'],
                'category' => $row['category']
            );
        }
        // Return the products data in JSON format
        echo json_encode($products);
    }
    else{
        // No product found
        echo json_encode(array('message' => 'No products found'));
    }
} else{
    // Invalid request method
    http_response_code(405);
    echo json_encode(array('error' => 'Method not Allowed'));
}

$conn->close();
?>