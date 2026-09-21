-- ============================================================
-- Migration: Make all UI buttons functional
-- Run against the `forge` database BEFORE restarting the app.
-- ============================================================

-- 1. users table — persist the user's chosen AI model
ALTER TABLE users
    ADD COLUMN selected_model VARCHAR(20) NOT NULL DEFAULT 'REASONING';

-- 2. ai_jobs table — store generated file metadata
ALTER TABLE ai_jobs
    ADD COLUMN result_file_path  VARCHAR(500) NULL,
    ADD COLUMN result_file_name  VARCHAR(255) NULL,
    ADD COLUMN result_file_type  VARCHAR(100) NULL;

-- 3. documents table — track which docs have been submitted to the RAG index
ALTER TABLE documents
    ADD COLUMN rag_indexed TINYINT(1) NOT NULL DEFAULT 0;
