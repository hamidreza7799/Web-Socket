$(document).ready(function () {
    var basketProducts;
    if(localStorage.getItem('websocket-basket') === null)
        basketProducts = {}
    else
        basketProducts = JSON.parse(localStorage.getItem('websocket-basket'))

    function getProducts(){
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/products',
            success: function (productsData) {
                for (index in productsData) {
                    var productData = productsData[index]
                    $("#products-column").append(`
                    <div class="card mb-4" id="product-${productData['id']}" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title" id="name-${productData['id']}">${productData["name"]}</h5>
                        </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item" id="price-${productData['id']}">price:${productData["price"]}</li>
                                <li class="list-group-item">Identifier:${productData["id"]}</li>
                                <li class="list-group-item" id="stock-${productData['id']}">Count of product in store:${productData["stock"]}</li>
                            </ul>
                        <div class="card-body">
                            <button href="#" class="btn btn-primary" id="add-basket-button-${productData['id']}">Add to basket</button>
                        </div>
                    </div>
                `)
                    functionalityForAddBasketButtons(productData)
                }

            },
            error: function () {
                $("#products-column").append(`
                <h2> Error in get products data </h2>
            `)
            }
        })
    }

    function getUserBasket(){
        var userBasketInfo = [];
        for(index in basketProducts){
            userBasketInfo.push({
                'productId': index,
                'countInBasket': basketProducts[index]
            })
        }
        console.log(userBasketInfo)
        $.ajax({
            type:'POST',
            url:'http://localhost:8080/user-basket',
            contentType:"application/json",
            data: JSON.stringify({
                'userBasketDTOList': userBasketInfo
            }),
            success: function (productsData) {
                for (index in productsData) {
                    var productData = productsData[index]
                    $("#basket-column").append(`
                    <div class="card mb-4" style="width: 18rem;" id="basket-card-${productData['id']}">
                        <div class="card-body">
                            <h5 class="card-title">${productData["name"]}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">price:${productData["price"]}</li>
                            <li class="list-group-item">Identifier:${productData["id"]}</li>
                            <li class="list-group-item" id="basket-product-count-${productData['id']}">Count of product in basket: ${productData['stock']}</li>
                        </ul>
                        <div class="card-body">
                            <button href="#" class="btn btn-primary" id="basket-product-add-${productData['id']}">Add count</button>
                            <button href="#" class="btn btn-danger" id="basket-product-minus-${productData['id']}">Minus count</button>
                        </div>
                    </div>
                `)
                    basketProducts[productData['id']] = productData['stock'];
                    functionalityForCountProductInBasket(productData['id'])
                }
                localStorage.setItem("websocket-basket", JSON.stringify(basketProducts))
            },
            error: function () {
                $("#basket-column").append(`
                <h2> Error in get basket data </h2>
            `)
            }
        })
    }

    var functionalityForAddBasketButtons = function (productData) {
        $(`#add-basket-button-${productData['id']}`).click(function () {
            if(basketProducts[productData['id']] === undefined){
                $("#basket-column").append(`
                    <div class="card mb-4" style="width: 18rem;" id="basket-card-${productData['id']}">
                        <div class="card-body">
                            <h5 class="card-title">${productData["name"]}</h5>
                        </div>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">price:${productData["price"]}</li>
                            <li class="list-group-item">Identifier:${productData["id"]}</li>
                            <li class="list-group-item" id="basket-product-count-${productData['id']}">Count of product in basket: 1</li>
                        </ul>
                        <div class="card-body">
                            <button href="#" class="btn btn-primary" id="basket-product-add-${productData['id']}">Add count</button>
                            <button href="#" class="btn btn-danger" id="basket-product-minus-${productData['id']}">Minus count</button>
                        </div>
                    </div>
                `)
                basketProducts[productData['id']] = 1;
                localStorage.setItem("websocket-basket", JSON.stringify(basketProducts))
                functionalityForCountProductInBasket(productData['id'])
            }
        })
    }

    var functionalityForCountProductInBasket = function (productId) {
        $(`#basket-product-add-${productId}`).click(function () {
            basketProducts[productId] = basketProducts[productId] + 1
            $(`#basket-product-count-${productId}`).html("Count of product in basket: " + basketProducts[productId])
            localStorage.setItem("websocket-basket", JSON.stringify(basketProducts))
        })
        $(`#basket-product-minus-${productId}`).click(function () {
            basketProducts[productId] = basketProducts[productId] - 1
            if(basketProducts[productId] === 0){
                basketProducts[productId] = undefined
                $(`#basket-card-${productId}`).remove()
            }
            else
                $(`#basket-product-count-${productId}`).html("Count of product in basket: " + basketProducts[productId])
            localStorage.setItem("websocket-basket", JSON.stringify(basketProducts))
        })
    }

    function subscribeToServer() {
        var socket = new SockJS('/websocket-handshaking');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/server-notifications', function (data) {
                data = JSON.parse(data.body)
                alert(data['notificationType'] + ' occur')
                if(data['notificationType'] === 'edit')
                    parseEditNotification(data['product'])
                else if(data['notificationType'] === 'delete')
                    parseRemoveNotification(data['product'])
                else if(data['notificationType'] === 'add')
                    parseAddNotification(data['product'])
            });
        });
    }

    function parseEditNotification(productInfo){
        $(`#name-${productInfo['id']}`).html(productInfo['name'])
        $(`#price-${productInfo['id']}`).html("price: " + productInfo['price'])
        $(`#stock-${productInfo['id']}`).html("count in store: " + productInfo['stock'])
    }

    function parseRemoveNotification(productInfo){
        $(`#product-${productInfo['id']}`).remove()
    }

    function parseAddNotification(productData) {
        $("#products-column").append(`
                    <div class="card mb-4" id="product-${productData['id']}" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title" id="name-${productData['id']}">${productData["name"]}</h5>
                        </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item" id="price-${productData['id']}">price:${productData["price"]}</li>
                                <li class="list-group-item">Identifier:${productData["id"]}</li>
                                <li class="list-group-item" id="stock-${productData['id']}">Count of product in store:${productData["stock"]}</li>
                            </ul>
                        <div class="card-body">
                            <button href="#" class="btn btn-primary" id="add-basket-button-${productData['id']}">Add to basket</button>
                        </div>
                    </div>
                `)
    }

    getProducts();
    getUserBasket();
    subscribeToServer();

    $("#submit-basket").click(function () {
        var userBasketInfo = [];
        for(index in basketProducts){
            userBasketInfo.push({
                'productId': index,
                'countInBasket': basketProducts[index]
            })
        }
        console.log(userBasketInfo)
        $.ajax({
            type:'POST',
            url:'http://localhost:8080/buy-products',
            contentType:"application/json",
            data: JSON.stringify({
                'userBasketDTOList': userBasketInfo
            }),
            success: function () {
                alert('success')
                $("#basket-column").empty()
                $("#basket-column").append(`
                <h1>Your basket</h1>
                    <button type="button" class="btn btn-primary btn-lg btn-block mb-4" id="submit-basket">Submit basket</button>
                `)
                basketProducts = {}
                localStorage.setItem("websocket-basket", JSON.stringify(basketProducts))
            },
            error: function (response) {
                console.log(response)
               alert(response.responseText)
            }
        })
    })

})
