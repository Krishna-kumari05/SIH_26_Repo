package com.backend.ai.entity;

import java.util.Arrays;
import java.util.List;

public final class ToolTaskType {

    private ToolTaskType() {}

    // Document Tools
    public static final String DOCUMENT_ANALYSER      = "DOCUMENT_ANALYSER";
    public static final String CODE_INTERPRETER       = "CODE_INTERPRETER";
    public static final String FILE_READER            = "FILE_READER";
    public static final String MATH_SOLVER            = "MATH_SOLVER";
    public static final String DOCUMENT_SUMMARIZER    = "DOCUMENT_SUMMARIZER";
    public static final String IMAGE_ANALYSER         = "IMAGE_ANALYSER";

    //Generator tools
    public static final String PDF_GENERATOR          = "PDF_GENERATOR";
    public static final String PPT_GENERATOR          = "PPT_GENERATOR";
    public static final String DOCS_GENERATOR         = "DOCS_GENERATOR";
    public static final String EXCEL_GENERATOR        = "EXCEL_GENERATOR";
    public static final String IMAGE_GENERATOR        = "IMAGE_GENERATOR";

    // engineering tools
    public static final String CODE_ASSISTANT         = "CODE_ASSISTANT";
    public static final String DATA_VISUALIZATION     = "DATA_VISUALIZATION";
    public static final String ENGINEERING_SOLVER     = "ENGINEERING_SOLVER";
    public static final String MACHINE_DESIGN         = "MACHINE_DESIGN";
    public static final String ELECTRICAL_DESIGN      = "ELECTRICAL_DESIGN";
    public static final String PCB_ANALYZER           = "PCB_ANALYZER";
    public static final String POWER_SYSTEM_ANALYZER  = "POWER_SYSTEM_ANALYZER";

    // design and cad tools
    public static final String CAD_ASSISTANT                  = "CAD_ASSISTANT";
    public static final String DATA_EXTRACTOR                 = "DATA_EXTRACTOR";
    public static final String KNOWLEDGE_BASED_SEARCH         = "KNOWLEDGE_BASED_SEARCH";
    public static final String DRAWING_ANALYSER_GENERATOR     = "DRAWING_ANALYSER_GENERATOR";
    public static final String BLUEPRINT_ANALYSER_GENERATOR   = "BLUEPRINT_ANALYSER_GENERATOR";
    public static final String ARCHITECTURE_DIAGRAM_GENERATOR = "ARCHITECTURE_DIAGRAM_GENERATOR";

    // chat / general
    public static final String CHAT          = "CHAT";
    public static final String DOCUMENT_CHAT = "DOCUMENT_CHAT";
    public static final String RAG_INGEST    = "RAG_INGEST";
    public static final String RAG_QUERY     = "RAG_QUERY";

    public static final List<String> FILE_GENERATING_TYPES = Arrays.asList(
            PDF_GENERATOR,
            PPT_GENERATOR,
            DOCS_GENERATOR,
            EXCEL_GENERATOR,
            IMAGE_GENERATOR,
            DRAWING_ANALYSER_GENERATOR,
            BLUEPRINT_ANALYSER_GENERATOR,
            ARCHITECTURE_DIAGRAM_GENERATOR
    );

    public static final List<String> ALL = Arrays.asList(
            DOCUMENT_ANALYSER, CODE_INTERPRETER, FILE_READER, MATH_SOLVER,
            DOCUMENT_SUMMARIZER, IMAGE_ANALYSER,
            PDF_GENERATOR, PPT_GENERATOR, DOCS_GENERATOR, EXCEL_GENERATOR, IMAGE_GENERATOR,
            CODE_ASSISTANT, DATA_VISUALIZATION, ENGINEERING_SOLVER, MACHINE_DESIGN,
            ELECTRICAL_DESIGN, PCB_ANALYZER, POWER_SYSTEM_ANALYZER,
            CAD_ASSISTANT, DATA_EXTRACTOR, KNOWLEDGE_BASED_SEARCH,
            DRAWING_ANALYSER_GENERATOR, BLUEPRINT_ANALYSER_GENERATOR, ARCHITECTURE_DIAGRAM_GENERATOR,
            CHAT, DOCUMENT_CHAT, RAG_INGEST, RAG_QUERY
    );
}
