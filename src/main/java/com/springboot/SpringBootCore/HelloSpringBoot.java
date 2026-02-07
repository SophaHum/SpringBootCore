package com.springboot.SpringBootCore;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloSpringBoot {
    @GetMapping("/")
    public String sayHello() {
        return "Hello, Spring Boot!  from Sopha";
    }

}
