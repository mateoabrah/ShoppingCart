// Esperamos a que el documento esté cargado
$(document).ready(function() {

    // Función para actualizar el valor total de la compra
    function actualizarTotal() {

        // Inicializamos la variable subtotal
        let subtotal = 0;

        // Recorremos cada fila de la tabla
        $(".row.my-3").each(function() {

            // Obtenemos el precio unitario y la cantidad
            let precioUnitario = parseFloat($(this).find(".preu-unitari").text().replace('€', ''));
            let cantidad = parseInt($(this).find("input[type='number']").val());

            // Calculamos el total por producto
            let totalProducto = precioUnitario * cantidad;

            // Actualizamos el precio del producto en la tabla
            $(this).find(".preu-producte").text(totalProducto + "€");

            // Sumamos al subtotal
            subtotal += totalProducto;
        });
        
        // Calculamos impuestos, envío y descuento
        let tax = subtotal * 0.05;
        let envio = 7;
        let descuento = $(".no-apply").is(":visible") ? 5 : 0;
        
        // Calculamos el total
        let total = subtotal + tax + envio - descuento;
        
        // Actualizamos los valores en la interfaz
        $(".list-group-item:contains('Subtotal') span").text(subtotal.toFixed(2) + "€");
        $(".list-group-item:contains('Total') strong").text(total.toFixed(2) + "€");
    }

    // Actualizamos el total cuando cambia la cantidad
    $("input[type='number']").on("change", function() {
        actualizarTotal();
    });

    // Eliminamos un producto del carrito
    $(".btn-outline-danger").on("click", function() {
        $(this).closest(".row.my-3").slideUp(400, function() {
            $(this).remove();
            actualizarTotal();
            actualizarBadge();
            verificarCheckout();
        });
    });

    // Función para actualizar el número de productos en el badge
    function actualizarBadge() {
        let totalItems = $(".row.my-3").length;
        $(".badge-pill").text(totalItems);
    }

    // Función para verificar si se puede proceder al checkout
    function verificarCheckout() {
        if ($(".row.my-3").length === 0) {
            $(".btn-success").prop("disabled", true).css("background", "grey");
        } else {
            $(".btn-success").prop("disabled", false).css("background", "");
        }
    }

    // Aplicamos el código promocional
    $(".btn-secondary").on("click", function() {
        let promoCode = $("input[placeholder='Promo code']").val();
        if (promoCode === "PROMO1000" && $(".no-apply").is(":hidden")) {
            $(".no-apply").slideDown();
        } else if (promoCode !== "PROMO1000") {
            $(".no-apply").slideUp();
        }
        actualizarTotal();
    });

    // Mostramos el modal de pago si se puede proceder al checkout
    $(".btn-success").on("click", function() {
        if (!$(this).prop("disabled")) {
            $("#payment_modal").modal("show");
        }
    });

    // Inicializamos los valores al cargar la página
    actualizarTotal();
    actualizarBadge();
    verificarCheckout();
});
