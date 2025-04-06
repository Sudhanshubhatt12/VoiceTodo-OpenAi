package com.voiceTodo.voiceTodo.controller;


import com.voiceTodo.voiceTodo.model.Task;
import com.voiceTodo.voiceTodo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    TaskService taskService;

    @PostMapping("/add/task")
    public ResponseEntity<Task> createTask(@RequestBody Task task){
         if(task==null){
             throw new RuntimeException();
         }
        Optional<Task > taskResponse=taskService.createTask(task);
         return ResponseEntity.of(taskResponse);
    }


    @GetMapping("/get/task/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id){
        Optional<Task> taskResponse=taskService.getTask(id);
        return ResponseEntity.of(taskResponse);
    }

    @GetMapping("/get/tasks")
    public ResponseEntity<List<Task>> getAllTask(){
        List<Task> taskResponse=taskService.getAllTask();
        return ResponseEntity.of(Optional.of(taskResponse));
    }

    @PutMapping("/update/task/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id,@RequestBody Task task){
        Optional<Task> taskResponse=taskService.getTask(id);
        return ResponseEntity.of(taskResponse);
    }

    @DeleteMapping("/delete/task/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id){
        try {
            taskService.deleteTask(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
