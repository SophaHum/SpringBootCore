package com.springboot.SpringBootCore.service;

import org.springframework.stereotype.Service;

import com.springboot.SpringBootCore.model.Todo;
import com.springboot.SpringBootCore.repository.TodoRepository;
import com.springboot.SpringBootCore.repository.UserRepository;
import com.springboot.SpringBootCore.model.User;
import java.util.List;
import com.springboot.SpringBootCore.dto.TodoRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public Todo createTodo(Long userId, TodoRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Todo todo = new Todo();
        todo.setUser(user);
        todo.setTitle(request.title());
        todo.setDescription(request.description());
        todo.setCreated_at(request.created_at());
        todo.setUpdated_at(request.updated_at());

        return todoRepository.save(todo);
    }

    public List<Todo> getTodosByUser(Long userId) {
        return todoRepository.findByUserId(userId);
    }

    public Todo getTodoById(Long id) {
        return todoRepository.findById(id).orElseThrow(() -> new RuntimeException("Todo not found"));
    }

    public Todo updateTodo(Long id, TodoRequest request) {
        Todo todo = todoRepository.findById(id).orElseThrow(() -> new RuntimeException("Todo not found"));
        todo.setTitle(request.title());
        todo.setDescription(request.description());
        todo.setCreated_at(request.created_at());
        todo.setUpdated_at(request.updated_at());
        return todoRepository.save(todo);
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
}
