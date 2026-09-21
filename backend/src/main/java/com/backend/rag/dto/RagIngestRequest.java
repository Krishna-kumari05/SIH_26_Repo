package com.backend.rag.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * Request body for POST /api/rag/ingest.
 */
@Getter
@Setter
public class RagIngestRequest {

    @NotNull(message = "documentId is required")
    private Long documentId;
}
