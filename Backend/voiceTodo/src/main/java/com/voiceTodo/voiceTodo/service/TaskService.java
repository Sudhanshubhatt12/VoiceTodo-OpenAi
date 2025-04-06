package com.voiceTodo.voiceTodo.service;

import com.voiceTodo.voiceTodo.model.Task;
import com.voiceTodo.voiceTodo.repository.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class TaskService {
    @Autowired
    TaskRepo taskRepo;

    public Optional<Task> createTask(Task task){
        Task task1=taskRepo.save(task);
       return Optional.of(task1);
    }

    public Optional<Task> getTask(Long id){
        return taskRepo.findById(id);
    }

    public List<Task> getAllTask(){
        return taskRepo.findAll();
    }
    public Optional<Task> updateTask(Long id,Task newTask){
        Optional<Task> existingTask=taskRepo.findById(id);
        if(existingTask.isPresent()){
            existingTask.get().setTask(newTask.getTask());
            existingTask.get().setUrgency(newTask.getUrgency());
            existingTask.get().setOperation(newTask.getOperation());
            existingTask.get().setDateTime(newTask.getDateTime());
            taskRepo.save(newTask);
            return  existingTask;
        }else{
            return null;
        }

    }
    public void deleteTask(Long id){
        if(taskRepo.existsById(id)) {
            taskRepo.deleteById(id);
        }
    }
}
