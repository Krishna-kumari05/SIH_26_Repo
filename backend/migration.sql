
ALTER TABLE users
    ADD COLUMN selected_model VARCHAR(20) NOT NULL DEFAULT 'REASONING';

ALTER TABLE ai_jobs
    ADD COLUMN result_file_path  VARCHAR(500) NULL,
    ADD COLUMN result_file_name  VARCHAR(255) NULL,
    ADD COLUMN result_file_type  VARCHAR(100) NULL;

ALTER TABLE documents
    ADD COLUMN rag_indexed TINYINT(1) NOT NULL DEFAULT 0;
