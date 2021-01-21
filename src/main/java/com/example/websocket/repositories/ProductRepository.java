package com.example.websocket.repositories;

import com.example.websocket.base.repository.BaseRepository;
import com.example.websocket.domains.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends BaseRepository<Product> {
}
