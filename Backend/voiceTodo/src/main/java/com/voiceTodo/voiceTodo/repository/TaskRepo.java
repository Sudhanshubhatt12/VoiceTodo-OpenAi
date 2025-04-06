package com.voiceTodo.voiceTodo.repository;

import com.voiceTodo.voiceTodo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepo extends JpaRepository<Task,Long> {

}
