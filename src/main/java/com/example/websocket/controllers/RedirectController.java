package com.example.websocket.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RedirectController {

    @GetMapping("/")
    public String sendMarketView(){
        return "market_view";
    }

    @GetMapping("/admin")
    public String sendAdminView(){return "admin_view";}

}
