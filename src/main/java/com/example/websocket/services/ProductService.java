package com.example.websocket.services;

import com.example.websocket.base.service.BaseService;
import com.example.websocket.domains.Product;
import com.example.websocket.domains.UserBasketDTO;
import com.example.websocket.repositories.ProductRepository;

import java.util.List;

public interface ProductService extends BaseService<Product, ProductRepository> {

    static final Integer changeDataBase = 1;

    List<Product> buyProducts(List<UserBasketDTO> userBasketDTOS);
}
