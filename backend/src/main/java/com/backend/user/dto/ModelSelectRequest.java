package com.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModelSelectRequest {

    @NotBlank(message = "model must not be blank")
    private String model;
}
