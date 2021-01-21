package com.example.websocket.domains;

import java.io.Serializable;

public class Notification implements Serializable {
    private String notificationType;
    private Product product;

    public Notification() {
    }

    public Notification(String notificationType, Product product) {
        this.notificationType = notificationType;
        this.product = product;
    }

    public String getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(String notificationType) {
        this.notificationType = notificationType;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
