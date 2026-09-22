package com.backend.ai.controller;

import com.backend.ai.dto.AIJobResponse;
import com.backend.ai.dto.ToolCatalogueItem;
import com.backend.ai.entity.AIJob;
import com.backend.ai.entity.ToolTaskType;
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

/**
 * Exposes:
 *   GET  /api/tools          — full tool catalogue (used to render the "Choose a tool" panel)
 *   POST /api/tools/run      — queue a job for any tool
 */
@RestController
@RequestMapping("/api/tools")
@RequiredArgsConstructor
public class ToolController {

    private final AIJobRepo aiJobRepo;
    private final DocumentRepo documentRepo;

    @GetMapping
    public List<ToolCatalogueItem> getCatalogue() {
        return List.of(
                // Document Tools
                new ToolCatalogueItem(ToolTaskType.DOCUMENT_ANALYSER,     "Document Analyser",             "Document Tools",    true,  false),
                new ToolCatalogueItem(ToolTaskType.CODE_INTERPRETER,       "Code Interpreter",              "Document Tools",    false, false),
                new ToolCatalogueItem(ToolTaskType.FILE_READER,            "File Reader",                   "Document Tools",    true,  false),
                new ToolCatalogueItem(ToolTaskType.MATH_SOLVER,            "Math Solver",                   "Document Tools",    false, false),
                new ToolCatalogueItem(ToolTaskType.DOCUMENT_SUMMARIZER,    "Document Summarizer",           "Document Tools",    true,  false),
                new ToolCatalogueItem(ToolTaskType.IMAGE_ANALYSER,         "Image Analyser",                "Document Tools",    true,  false),

                // Generator Tools
                new ToolCatalogueItem(ToolTaskType.PDF_GENERATOR,          "Pdf Generator",                 "Generator Tools",   false, true),
                new ToolCatalogueItem(ToolTaskType.PPT_GENERATOR,          "Ppt Generator",                 "Generator Tools",   false, true),
                new ToolCatalogueItem(ToolTaskType.DOCS_GENERATOR,         "Docs Generator",                "Generator Tools",   false, true),
                new ToolCatalogueItem(ToolTaskType.EXCEL_GENERATOR,        "Excel Generator",               "Generator Tools",   false, true),
                new ToolCatalogueItem(ToolTaskType.IMAGE_GENERATOR,        "Image Generator",               "Generator Tools",   false, true),

                // Engineering Tools
                new ToolCatalogueItem(ToolTaskType.CODE_ASSISTANT,         "Code Assistant",                "Engineering Tools", false, false),
                new ToolCatalogueItem(ToolTaskType.DATA_VISUALIZATION,     "Data Visualization",            "Engineering Tools", false, false),
                new ToolCatalogueItem(ToolTaskType.ENGINEERING_SOLVER,     "Engineering Solver",            "Engineering Tools", false, false),
                new ToolCatalogueItem(ToolTaskType.MACHINE_DESIGN,         "Machine Design",                "Engineering Tools", false, false),
                new ToolCatalogueItem(ToolTaskType.ELECTRICAL_DESIGN,      "Electrical Design",             "Engineering Tools", false, false),
                new ToolCatalogueItem(ToolTaskType.PCB_ANALYZER,           "PCB Analyzer",                  "Engineering Tools", false, false),
                new ToolCatalogueItem(ToolTaskType.POWER_SYSTEM_ANALYZER,  "Power System Analyzer",         "Engineering Tools", false, false),

                // Design & CAD Tools
                new ToolCatalogueItem(ToolTaskType.CAD_ASSISTANT,                  "CAD Assistant",                  "Design & CAD Tools", false, false),
                new ToolCatalogueItem(ToolTaskType.DATA_EXTRACTOR,                 "Data Extractor",                 "Design & CAD Tools", true,  false),
                new ToolCatalogueItem(ToolTaskType.KNOWLEDGE_BASED_SEARCH,         "Knowledge Based Search",         "Design & CAD Tools", false, false),
                new ToolCatalogueItem(ToolTaskType.DRAWING_ANALYSER_GENERATOR,     "Drawing Analyser and Generator", "Design & CAD Tools", true,  true),
                new ToolCatalogueItem(ToolTaskType.BLUEPRINT_ANALYSER_GENERATOR,   "Blueprint Analyser and Generator","Design & CAD Tools",true, true),
                new ToolCatalogueItem(ToolTaskType.ARCHITECTURE_DIAGRAM_GENERATOR, "Architecture Diagram Generator", "Design & CAD Tools", false, true)
        );
    }

    @PostMapping("/run")
    public ResponseEntity<AIJobResponse> runTool(
            @Valid @RequestBody ChatMessageRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        if (request.getTaskType() == null || request.getTaskType().isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .build();
        }

        if (!ToolTaskType.ALL.contains(request.getTaskType())) {
            return ResponseEntity
                    .status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(null);
        }

        Document document = null;
        if (request.getDocumentId() != null) {
            document = documentRepo
                    .findByIdAndUserId(request.getDocumentId(), user.getId())
                    .orElseThrow(() -> new RuntimeException("Document not found"));
        }

        AIJob job = AIJob.builder()
                .user(user)
                .document(document)
                .taskType(request.getTaskType())
                .prompt(request.getPrompt())
                .build();

        aiJobRepo.save(job);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(job));
    }


    @GetMapping("/validate/{taskType}")
    public ResponseEntity<Map<String, Object>> validateTaskType(
            @PathVariable String taskType
    ) {
        boolean valid = ToolTaskType.ALL.contains(taskType);
        return ResponseEntity.ok(Map.of(
                "taskType", taskType,
                "valid", valid
        ));
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
