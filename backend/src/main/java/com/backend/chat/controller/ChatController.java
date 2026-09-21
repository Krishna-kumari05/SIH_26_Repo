package com.backend.chat.controller;

import com.backend.ai.dto.AIJobResponse;
import com.backend.ai.dto.ChatSearchResult;
import com.backend.ai.entity.AIJob;
import com.backend.ai.repo.AIJobRepo;
import com.backend.chat.dto.ChatMessageRequest;
import com.backend.document.entity.Document;
import com.backend.document.repo.DocumentRepo;
import com.backend.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final AIJobRepo aiJobRepo;
    private final DocumentRepo documentRepo;

    // ──────────────────────────────────────────────────────────────────────────
    // POST /api/chat/message  →  send a message / run a tool on the active chat
    // ──────────────────────────────────────────────────────────────────────────
    @PostMapping("/message")
    public ResponseEntity<AIJobResponse> sendMessage(
            @Valid @RequestBody ChatMessageRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        Document document = null;
        if (request.getDocumentId() != null) {
            document = documentRepo.findByIdAndUserId(request.getDocumentId(), user.getId())
                    .orElseThrow(() -> new RuntimeException("Document not found"));
        }

        String taskType = request.getTaskType();
        if (taskType == null || taskType.isBlank()) {
            taskType = document != null ? "DOCUMENT_CHAT" : "CHAT";
        }

        AIJob job = AIJob.builder()
                .user(user)
                .document(document)
                .taskType(taskType)
                .prompt(request.getPrompt())
                .build();

        aiJobRepo.save(job);

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(job));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // POST /api/chat/new  →  "New chat" sidebar button
    // Clears active-document context client-side; server returns acknowledgement.
    // ──────────────────────────────────────────────────────────────────────────
    @PostMapping("/new")
    public ResponseEntity<Map<String, String>> newChat(Authentication authentication) {
        // No server-side session to clear (stateless JWT); just signal OK so the
        // frontend can reset its local state (active document, messages, etc.)
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "message", "New chat session started"
        ));
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/chat/history  →  pageable list of past jobs for the sidebar
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/history")
    public List<AIJobResponse> getChatHistory(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return aiJobRepo
                .findAllByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // GET /api/chat/search?q=keyword  →  "Search chat" sidebar button
    // ──────────────────────────────────────────────────────────────────────────
    @GetMapping("/search")
    public ResponseEntity<List<ChatSearchResult>> searchChat(
            @RequestParam(name = "q", defaultValue = "") String query,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        if (query.isBlank()) {
            return ResponseEntity.ok(List.of());
        }

        List<ChatSearchResult> results = aiJobRepo
                .findAllByUserIdAndPromptContainingIgnoreCaseOrderByCreatedAtDesc(
                        user.getId(),
                        query
                )
                .stream()
                .map(job -> new ChatSearchResult(
                        job.getId(),
                        job.getTaskType(),
                        job.getPrompt().length() > 200
                                ? job.getPrompt().substring(0, 200) + "…"
                                : job.getPrompt(),
                        job.getStatus().name(),
                        job.getCreatedAt()
                ))
                .toList();

        return ResponseEntity.ok(results);
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
