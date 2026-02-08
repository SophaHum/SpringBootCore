package com.springboot.SpringBootCore.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.springboot.SpringBootCore.model.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserId(Long userId);
}
