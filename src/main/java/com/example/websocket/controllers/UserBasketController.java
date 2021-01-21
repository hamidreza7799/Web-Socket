package com.example.websocket.controllers;

import com.example.websocket.domains.Product;
import com.example.websocket.domains.UserBasketDTO;
import com.example.websocket.domains.UserBasketDTOWrapper;
import com.example.websocket.services.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/user-basket")
public class UserBasketController {

    private final ProductService productService;

    public UserBasketController(ProductService productService) {
        this.productService = productService;
    }


    @PostMapping
    public List<Product> sendUserBasket(@RequestBody UserBasketDTOWrapper userBasketDTOWrapper){
        List<Product> userProductsInfo = new ArrayList<>();
        for(UserBasketDTO userBasketDTO:userBasketDTOWrapper.getUserBasketDTOList()){
            userProductsInfo.add(
                    this.convertToCustom(
                            productService
                                    .findById(userBasketDTO.getProductId()).get(), userBasketDTO.getCountInBasket()));
        }
        return userProductsInfo;
    }

    private Product convertToCustom(Product product, Integer countInBasket){
        product.setStock(countInBasket);
        return product;
    }
}
