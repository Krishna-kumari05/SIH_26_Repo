package com.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class ModelResponse {

    private String selectedModel;

    private List<String> availableModels;
}
