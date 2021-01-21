package com.example.websocket.domains;

public class UserBasketDTO {

    private Long productId;
    private Integer countInBasket;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getCountInBasket() {
        return countInBasket;
    }

    public void setCountInBasket(Integer countInBasket) {
        this.countInBasket = countInBasket;
    }
}
