package com.backend.ai.controller;

import com.backend.ai.dto.AIJobResponse;
import com.backend.ai.entity.AIJob;
import com.backend.ai.entity.JobStatus;
import com.backend.ai.repo.AIJobRepo;
import com.backend.document.entity.Document;
import com.backend.document.repo.DocumentRepo;
import com.backend.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/generated-files")
@RequiredArgsConstructor
public class GeneratedFileController {

    private final AIJobRepo aiJobRepo;
    private final DocumentRepo documentRepo;

    @GetMapping
    public List<AIJobResponse> listGeneratedFiles(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return aiJobRepo
                .findAllByUserIdAndStatusAndResultFileNameIsNotNullOrderByCreatedAtDesc(
                        user.getId(),
                        JobStatus.COMPLETED
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{jobId}/download")
    public ResponseEntity<Resource> downloadGeneratedFile(
            @PathVariable Long jobId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        AIJob job = aiJobRepo
                .findByIdAndUserId(jobId, user.getId())
                .orElseThrow(() -> new RuntimeException("Generated file not found"));

        if (job.getResultFilePath() == null || job.getResultFilePath().isBlank()) {
            throw new RuntimeException("No file associated with this job");
        }

        Resource resource = new FileSystemResource(Paths.get(job.getResultFilePath()));

        if (!resource.exists() || !resource.isReadable()) {
            throw new RuntimeException("File not found on storage");
        }

        String contentType = job.getResultFileType() != null
                ? job.getResultFileType()
                : "application/octet-stream";

        String fileName = job.getResultFileName() != null
                ? job.getResultFileName()
                : "generated-file";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileName + "\"")
                .header(HttpHeaders.CONTENT_TYPE, contentType)
                .body(resource);
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
