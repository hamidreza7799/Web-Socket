$(document).ready(function () {
    $("#create-product-button").click(function () {
        $.ajax({
            url:"http://localhost:8080/products",
            type: 'POST',
            contentType:"application/json",
            data:JSON.stringify({
                name: $(`#product-name`).val(),
                price: $(`#product-price`).val(),
                stock: $(`#product-stock`).val(),
            }),
            success: function (productData) {
                alert("success")
                $("#products-column").append(`
                    <div class="card mb-4" style="width: 18rem;" id="product-${productData['id']}">
                        <div class="card-body">
                            <input type="text" id="name-${productData['id']}" value="${productData["name"]}">
                        </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <label for="price-${productData['id']}">Price</label>
                                    <input type="number" id="price-${productData['id']}" value="${productData["price"]}">
                                </li>
                                <li class="list-group-item">Identifier:${productData["id"]}</li>
                                <li class="list-group-item">
                                    <label for="stock-${productData['id']}">Stock</label>
                                    <input type="number" id="stock-${productData['id']}" value="${productData["stock"]}">
                                </li>
                            </ul>
                        <div class="card-body">
                            <button href="#" class="btn btn-primary mb-2" id="edit-product-button-${productData['id']}">Edit product</button>
                            <button href="#" class="btn btn-danger" id="remove-product-button-${productData['id']}">Remove product</button>
                        </div>
                    </div>
                `)
                functionalityForEditProduct(productData['id'])
                functionalityForRemoveProduct(productData['id'])
            },
            error: function () {
                alert("error")
            }
        })
    })

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/products',
        success: function (productsData) {
            for (index in productsData) {
                var productData = productsData[index]
                $("#products-column").append(`
                    <div class="card mb-4" style="width: 18rem;" id="product-${productData['id']}">
                        <div class="card-body">
                            <input type="text" id="name-${productData['id']}" value="${productData["name"]}">
                        </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">
                                    <label for="price-${productData['id']}">Price</label>
                                    <input type="number" id="price-${productData['id']}" value="${productData["price"]}">
                                </li>
                                <li class="list-group-item">Identifier:${productData["id"]}</li>
                                <li class="list-group-item">
                                    <label for="stock-${productData['id']}">Stock</label>
                                    <input type="number" id="stock-${productData['id']}" value="${productData["stock"]}">
                                </li>
                            </ul>
                        <div class="card-body">
                            <button href="#" class="btn btn-primary mb-2" id="edit-product-button-${productData['id']}">Edit product</button>
                            <button href="#" class="btn btn-danger" id="remove-product-button-${productData['id']}">Remove product</button>
                        </div>
                    </div>
                `)
                functionalityForEditProduct(productData['id'])
                functionalityForRemoveProduct(productData['id'])
            }

        },
        error: function () {
            $("#products-column").append(`
                <h2> Error in get products data </h2>
            `)
        }
    })

    var functionalityForEditProduct = function (productId) {

        $(`#edit-product-button-${productId}`).click(function () {
            $.ajax({
                url:"http://localhost:8080/products/",
                type: 'PUT',
                contentType:"application/json",
                data:JSON.stringify({
                    id: productId,
                    name: $(`#name-${productId}`).val(),
                    price: $(`#price-${productId}`).val(),
                    stock: $(`#stock-${productId}`).val(),
                }),
                success: function (data) {
                    alert("success")
                },
                error: function () {
                    alert("error")
                }
            })
        })
    }

    var functionalityForRemoveProduct = function (productId) {
        $(`#remove-product-button-${productId}`).click(function () {
            $.ajax({
                url:"http://localhost:8080/products/" + productId,
                type: 'DELETE',
                success: function () {
                    $(`#product-${productId}`).remove()
                    console.log('delete')
                },
                error: function () {
                    console.log('error')
                }
            })

        })
    }
})