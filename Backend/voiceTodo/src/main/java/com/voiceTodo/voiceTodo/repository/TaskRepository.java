package com.voiceTodo.voiceTodo.repository;

import com.voiceTodo.voiceTodo.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {

}
