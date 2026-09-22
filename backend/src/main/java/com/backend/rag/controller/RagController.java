package com.backend.rag.controller;

import com.backend.ai.dto.AIJobResponse;
import com.backend.ai.entity.AIJob;
import com.backend.ai.entity.ToolTaskType;
import com.backend.ai.repo.AIJobRepo;
import com.backend.document.dto.DocumentResponse;
import com.backend.document.entity.Document;
import com.backend.document.repo.DocumentRepo;
import com.backend.rag.dto.RagIngestRequest;
import com.backend.rag.dto.RagQueryRequest;
import com.backend.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rag")
@RequiredArgsConstructor
public class RagController {

    private final AIJobRepo aiJobRepo;
    private final DocumentRepo documentRepo;

    @PostMapping("/ingest")
    public ResponseEntity<AIJobResponse> ingestDocument(
            @Valid @RequestBody RagIngestRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        Document document = documentRepo
                .findByIdAndUserId(request.getDocumentId(), user.getId())
                .orElseThrow(() -> new RuntimeException("Document not found"));

        // Mark the document as submitted for RAG indexing
        document.setRagIndexed(true);
        documentRepo.save(document);

        AIJob job = AIJob.builder()
                .user(user)
                .document(document)
                .taskType(ToolTaskType.RAG_INGEST)
                .prompt("Ingest document: " + document.getOriginalFilename())
                .build();

        aiJobRepo.save(job);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(job));
    }

    @PostMapping("/query")
    public ResponseEntity<AIJobResponse> queryRag(
            @Valid @RequestBody RagQueryRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        Document document = null;
        if (request.getDocumentId() != null) {
            document = documentRepo
                    .findByIdAndUserId(request.getDocumentId(), user.getId())
                    .orElseThrow(() -> new RuntimeException("Document not found"));
        }

        AIJob job = AIJob.builder()
                .user(user)
                .document(document)
                .taskType(ToolTaskType.RAG_QUERY)
                .prompt(request.getQuery())
                .build();

        aiJobRepo.save(job);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(job));
    }

    @GetMapping("/documents")
    public List<DocumentResponse> getIndexedDocuments(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return documentRepo
                .findAllByUserIdAndRagIndexedTrueOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(doc -> new DocumentResponse(
                        doc.getId(),
                        doc.getOriginalFilename(),
                        doc.getFileType(),
                        doc.getFileSize(),
                        doc.getCreatedAt()
                ))
                .toList();
    }

    private AIJobResponse toResponse(AIJob job) {
        return new AIJobResponse(
                job.getId(),
                job.getDocument() != null ? job.getDocument().getId() : null,
                job.getTaskType(),
                job.getPrompt(),
                job.getStatus(),
                job.getResult(),
                job.getErrorMessage(),
                job.getCreatedAt(),
                job.getStartedAt(),
                job.getCompletedAt(),
                job.getResultFileName(),
                job.getResultFileType()
        );
    }
}
