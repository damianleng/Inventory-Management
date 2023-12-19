$(document).ready(function(){
    // Fetch the products when page loads
    fetchProducts();

    // Event listener for edit, save, delete
    $('#productTable').on('click', '.edit-btn', function(){
        // Dynamically edit the fields
        var row = $(this).closest('tr');
        editProduct(row);
    });

     $('#productTable').on('click', '.save-btn', function(){
        var row = $(this).closest('tr');
        var productId = row.data('product-id');
        saveProduct(row, productId);
    });

    $('#productTable').on('click', '.delete-btn', function(){
        // Remove the row when delete button is clicked
        var row = $(this).closest('tr');
        var productId = row.data('product-id');
        deleteProduct(row, productId);
    });

    $('#searchProduct').on('input', function(){
        var searchTerm = $(this).val().toLowerCase();
        filterProducts(searchTerm);
    });

    function fetchProducts() {
        // Fetch products using AJAX
        fetch('product.php')
          .then(response => {
            // Check if the request was successful (status code in the range 200-299)
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            // Parse the JSON from the response
            return response.json();
          })
          .then(data => {
            // Render products in the table
            renderProducts(data);
          })
          .catch(error => {
            console.error('Error fetching products:', error);
          });
    }

    function renderProducts(products){
        // Clear existing rows
        $('#productTable tbody').empty();
        // Render the new rows
        products.forEach(product => {
            var newRow = "<tr data-product-id='" + product.id + "' class='align-middle'>" +
                "<td>" +
                  "<img src='" + product.image_path + "' alt='' width='50' height='50' class='img-fluid rounded'>" +
                "</td>" +
                "<td class='category'>" + product.category + "</td>" +
                "<td class='product-name'>" + product.product_name + "</td>" +
                "<td class='cost'>$" + product.cost + "</td>" +
                "<td class='price'>$" + product.price + "</td>" +
                "<td class='quantity'>" + product.quantity + "</td>" +
                "<td class='action-buttons'>" +
                  "<div class='d-flex gap-1'>" +
                    "<button class='badge rounded-pill text-bg-warning edit-btn'>Edit</button>" +
                    "<button class='badge rounded-pill text-bg-danger delete-btn'>Delete</button>" +
                  "</div>" +
                "</td>" +
              "</tr>";
           $('#productTable tbody').append(newRow);
        });
    }

    function editProduct(row){
        // Get the current values from the row
        var currentCategory = row.find('.category').text();
        var currentProductName = row.find('.product-name').text();
        var currentCost = parseFloat(row.find('.cost').text().replace('$', '')).toFixed(2);
        var currentPrice = parseFloat(row.find('.price').text().replace('$', '')).toFixed(2);
        var currentQuantity = row.find('.quantity').text();

        row.find('.category').html('<input type="text" class="edit-category rounded" value="' + currentCategory + '">');
        row.find('.product-name').html('<input type="text" class="edit-product-name rounded" value="' + currentProductName + '">');
        row.find('.cost').html('<input type="number" class="edit-cost rounded" value="' + currentCost + '">');
        row.find('.price').html('<input type="number" class="edit-price rounded" value="' + currentPrice + '">');
        row.find('.quantity').html('<input type="number" class="edit-quantity rounded" value="' + currentQuantity + '">');

        // Change the "Edit" button to "Save"
        row.find('.edit-btn').text('Save').toggleClass('edit-btn save-btn');
    }

    function saveProduct(row, productId){
        // Get the edited values from the input fields
        var editedCategory = row.find('.edit-category').val();
        var editedProductName = row.find('.edit-product-name').val();
        var editedCost = parseFloat(row.find('.edit-cost').val()).toFixed(2); // Format to two decimal places
        var editedPrice = parseFloat(row.find('.edit-price').val()).toFixed(2); // Format to two decimal places
        var editedQuantity = row.find('.edit-quantity').val();

        // Save the updated product to the database
        $.ajax({
            type: "POST",
            url: "save_product.php",
            data: {
                productId: productId,
                category: editedCategory,
                productName: editedProductName,
                cost: editedCost,
                price: editedPrice,
                quantity: editedQuantity
            },
            success: function(response){    
                // Update the row with the edited values
                row.find('.category').text(editedCategory);
                row.find('.product-name').text(editedProductName);
                row.find('.cost').text('$' + editedCost);
                row.find('.price').text('$' + editedPrice);
                row.find('.quantity').text(editedQuantity); 
                
                // Reload the page after saving
                window.location.reload();
            },
            error: function(error){
                console.error("Error saving product ", error);
            }
        });
    }

    function deleteProduct(row, productId) {
        // Remove the row when delete button is clicked
        $.ajax({
            type: "POST",
            url: "delete_product.php",
            data: {
                productId: productId
            },
            success: function(response){
                console.log(response);
                row.remove();
            },
            error: function(error){
                console.error("Error deleting product ", error);
            }
        });
    }

    function filterProducts(searchTerm){
        // Hide all rows
        $('#productTable tbody tr').hide();

        // Show only the rows that match the search term
        $('#productTable tbody tr').filter(function() {
            return $(this).text().toLowerCase().includes(searchTerm);
        }).show();
    }

});