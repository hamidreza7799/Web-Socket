package com.example.websocket.services.impl;

import com.example.websocket.base.service.impl.BaseServiceImpl;
import com.example.websocket.domains.Product;
import com.example.websocket.domains.UserBasketDTO;
import com.example.websocket.repositories.ProductRepository;
import com.example.websocket.services.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl extends BaseServiceImpl<Product, ProductRepository> implements ProductService {

    public ProductServiceImpl(ProductRepository repository) {
        super(repository);
    }

    @Override
    public List<Product> buyProducts(List<UserBasketDTO> userBasketDTOS) {
        synchronized (ProductService.changeDataBase) {
            List<Product> userProducts = new ArrayList<>();
            for (UserBasketDTO userBasketDTO : userBasketDTOS) {
                Optional<Product> product = this.findById(userBasketDTO.getProductId());
                if (product.isEmpty())
                    return null;
                if (product.get().getStock() < userBasketDTO.getCountInBasket())
                    return null;
                userProducts.add(product.get());
            }
            for (int index = 0; index < userBasketDTOS.size(); index++) {
                userProducts.get(index)
                        .setStock(userProducts.get(index).getStock() - userBasketDTOS.get(index).getCountInBasket());
                this.save(userProducts.get(index));
            }
            return userProducts;
        }
    }
}
