package com.backend.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ToolCatalogueItem {

    private String taskType;

    private String displayName;

    private String category;

    private boolean requiresDocument;

    private boolean generatesFile;
}
