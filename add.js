$(document).ready(function(){
    $('#addProduct').click(function(e){
        $('.invalid-message').html('');
        e.preventDefault();
        var productName = $('#productName').val();
        var category = $('select[name="type"]').val();
        var cost = parseFloat($('#cost').val()).toFixed(2); // Format to two decimal places
        var price = parseFloat($('#price').val()).toFixed(2); // Format to two decimal places
        var quantity = $('#quantity').val();
        var productImage = $('#productImage')[0].files[0];
        var errorContainer = $('.invalid-message');

        if(productName === '' || category === '' || cost === '' || price === '' || quantity === ''){
            errorContainer.text('Please fill in a value');
            return;
        }

        // Clear input fields after adding the product
         $('#productName').val('');
         $('select[name="type"]').val('');
         $('#cost').val('');
         $('#price').val('');
         $('#quantity').val('');

        // Create FormData object
        var formData = new FormData();
        formData.append('productName', productName);
        formData.append('category', category);
        formData.append('cost', cost);
        formData.append('price', price);
        formData.append('quantity', quantity);
        formData.append('productImage', productImage);

        saveProduct(formData);
    })

    function saveProduct(data){
        $.ajax({
            type: "POST",
            url: "save_product.php",
            data: data,
            contentType: false,
            processData: false,
            success: function(response){
                var productId = response;
                $('#productTable tbody tr:last').attr('data-product-id', productId);
                $('#success-alert').removeClass('d-none');
            },
            error: function(error){
                console.error("Error saving product ", error);
            }
        });
    }
});