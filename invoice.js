$(document).ready(function(){
    $('#printBtn').click(function(){
        window.print();
    })

    function getFormattedDate() {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleDateString('en-US', { month: 'long' });
        const year = now.getFullYear();
    
        const ordinalSuffix = getOrdinalSuffix(day);
    
        return `${day}${ordinalSuffix} ${month} ${year}`;
    }
    
    function getOrdinalSuffix(number) {
        const suffixes = ["th", "st", "nd", "rd"];
        const v = number % 100;
        return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
    }
    
    // Example usage:
    var currentDate = getFormattedDate();

    // Update the text content of the <span> element
    $('.invoice-head-middle-left span.text-bold').text('Date: ' + currentDate);

    let index = 3; // initialize the counter with the last index
    let addedRows = [];
    
    $('#addBtn').click(function(){
        index++;
        // HTML code for a table row with the incremented index
        const tableRowHTML = `
        <tr>
            <td>${index}</td>
            <td contenteditable="true"></td>
            <td class="rate" contenteditable="true"></td>
            <td class="qty" contenteditable="true"></td>
            <td class="text-end"></td>
        </tr>`;

        const $tempDiv = $('<div>').html(tableRowHTML);
        const $clonedRow = $tempDiv.children().clone();
        $('#invoice-table-body').append($clonedRow);
        addedRows.push($clonedRow);
    });

    $('#removeBtn').click(function () {
        if (addedRows.length > 0) {
            addedRows.pop().remove();
            index--;
        }
    });

    $('#invoice-table-body').on('blur', 'td[contenteditable="true"].rate', function(){
        format$(this);
    });

    $('#discount-value').on('blur', function(){
        const discountValue = parseFloat($(this).text()) || 0;
        const discountPercentage = discountValue > 0 ? discountValue + '%' : '';
        $(this).text(discountPercentage);
        calculateTotal();
    })

    $('#invoice-table-body').on('input', 'td[contenteditable="true"].rate, td[contenteditable="true"].qty', function(){
        const $row = $(this).closest('tr');
        const rate = parseFloat($row.find('td.rate[contenteditable="true"]').text().replace('$', '')) || 0;
        const qty = parseInt($row.find('td.qty[contenteditable="true"]').text()) || 0;

        // Check if either rate or qty is set
        if (rate !== 0 || qty !== 0) {
            const amount = rate * qty;
            $row.find('td.text-end').text('$' + amount.toFixed(2));
        }
        calculateSubtotal();
        calculateTotal();
    });

    $('li[contenteditable="true"]').on('focus', function(){
        $(this).data('initialText', $(this).text());
        $(this).text('');
    })

    $('li[contenteditable="true"]').on('blur', function(){
        var temp = $(this).data('initialText');
        var newText = $(this).text();

        if(newText.trim() === ''){
            $(this).text(temp);
        }
    })

    function calculateSubtotal(){
        let subtotal = 0;
        
        $('#invoice-table-body tr').each(function(){
            const amountText = $(this).find('td.text-end').text();
            const amountValue = parseFloat(amountText.replace('$', '')) || 0;

            subtotal += amountValue;
        });

        $('.info-item-td.text-end.text-bold:contains("Sub Total:") + .text-end').text('$' + subtotal.toFixed(2));
    }

    function calculateTotal(){
        const subtotal = parseFloat($('.info-item-td.text-end.text-bold:contains("Sub Total:") + .text-end').text().replace('$', '')) || 0;
        const discountValue = parseFloat($('#discount-value').text()) || 0;
        const discountPercentage = discountValue > 0 ? (100 - discountValue) / 100 : 1;
        const total = (subtotal * discountPercentage).toFixed(2);
        $('#total-value').text('$' + total);
    }

    function format$(cell) {
        const inputValue = $(cell).text().trim();
        const formattedValue = parseFloat(inputValue).toFixed(2);
        $(cell).text('$' + formattedValue);
    }
    
    calculateSubtotal();
});

