package com.voiceTodo.voiceTodo.model;


import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Task {
    private long id;
    private String operation;
    private String task;
    private String urgency;
    private String dateTime;

}
