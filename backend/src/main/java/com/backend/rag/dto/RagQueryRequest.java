package com.backend.rag.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Request body for POST /api/rag/query.
 */
@Getter
@Setter
public class RagQueryRequest {

    @NotBlank(message = "query must not be blank")
    private String query;

    /**
     * Optional: restrict the RAG search to a specific ingested document.
     */
    private Long documentId;
}
