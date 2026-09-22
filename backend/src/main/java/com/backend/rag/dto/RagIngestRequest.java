package com.backend.rag.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RagIngestRequest {

    @NotNull(message = "documentId is required")
    private Long documentId;
}
