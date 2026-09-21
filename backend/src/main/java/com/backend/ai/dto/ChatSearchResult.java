package com.backend.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;


@Getter
@AllArgsConstructor
public class ChatSearchResult {

    private Long jobId;
    private String taskType;
    private String promptSnippet;   // first 200 chars of the prompt
    private String status;
    private LocalDateTime createdAt;
}
