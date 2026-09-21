package com.backend.user.controller;

import com.backend.user.dto.ModelResponse;
import com.backend.user.dto.ModelSelectRequest;
import com.backend.user.entity.User;
import com.backend.user.repo.UserRepo;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/model")
@RequiredArgsConstructor
public class ModelController {

    private static final List<String> AVAILABLE_MODELS = List.of(
            "REASONING",
            "CODING",
            "VISION",
            "FAST"
    );

    private final UserRepo userRepo;
    @GetMapping("/available")
    public ResponseEntity<Map<String, Object>> getAvailableModels() {
        return ResponseEntity.ok(Map.of(
                "models", AVAILABLE_MODELS
        ));
    }

    @GetMapping("/selected")
    public ResponseEntity<ModelResponse> getSelectedModel(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        String selected = user.getSelectedModel() != null
                ? user.getSelectedModel()
                : "REASONING";

        return ResponseEntity.ok(new ModelResponse(selected, AVAILABLE_MODELS));
    }

    @PutMapping("/select")
    public ResponseEntity<ModelResponse> selectModel(
            @Valid @RequestBody ModelSelectRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        String model = request.getModel().toUpperCase();

        if (!AVAILABLE_MODELS.contains(model)) {
            throw new RuntimeException(
                    "Unknown model '" + model + "'. Available: " + AVAILABLE_MODELS
            );
        }

        user.setSelectedModel(model);
        userRepo.save(user);

        return ResponseEntity.ok(new ModelResponse(model, AVAILABLE_MODELS));
    }
}
