package com.example.websocket.controllers;

import com.example.websocket.domains.Notification;
import com.example.websocket.domains.Product;
import com.example.websocket.domains.UserBasketDTOWrapper;
import com.example.websocket.services.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
public class ProductController {

    private final ProductService productService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public ProductController(ProductService productService, SimpMessagingTemplate simpMessagingTemplate) {
        this.productService = productService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @GetMapping("/products")
    public List<Product> sendProducts() {
        return new ArrayList<>(productService.findAll());
    }

    @PostMapping("/products")
    public Product createNewProduct(@RequestBody Product product) {
        productService.save(product);
        this.simpMessagingTemplate.convertAndSend(
                "/topic/server-notifications", new Notification("add", product));
        return product;
    }

    @PostMapping("/buy-products")
    public ResponseEntity<String> buyProducts(@RequestBody UserBasketDTOWrapper userBasketDTOWrapper){
        List<Product> products = productService.buyProducts(userBasketDTOWrapper.getUserBasketDTOList());
        if(products == null)
            return ResponseEntity.badRequest().body("We dont have enough product in our store");
        else
            for (Product product:products)
                this.simpMessagingTemplate
                        .convertAndSend("/topic/server-notifications", new Notification("edit", product));
        return ResponseEntity.ok("success");
    }

    @PutMapping("/products")
    public Product updateProduct(@RequestBody Product product) {
        productService.save(product);
        this.simpMessagingTemplate.convertAndSend(
                "/topic/server-notifications", new Notification("edit", product));
        return product;
    }

    @DeleteMapping("/products/{productId}")
    public void deleteProduct(@PathVariable Long productId) {
        Optional<Product> product = productService.findById(productId);
        productService.deleteById(productId);
        this.simpMessagingTemplate.convertAndSend(
                "/topic/server-notifications", new Notification("delete", product.get()));
    }


}
