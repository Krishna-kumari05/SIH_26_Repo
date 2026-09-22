package com.backend.rag.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RagQueryRequest {

    @NotBlank(message = "query must not be blank")
    private String query;

    private Long documentId;
}
