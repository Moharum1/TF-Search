CREATE TABLE documents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE terms (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    term TEXT NOT NULL UNIQUE
);

CREATE TABLE document_terms (
    document_id BIGINT NOT NULL,
    term_id BIGINT NOT NULL,
    term_count INTEGER NOT NULL CHECK (term_count >= 0),

    PRIMARY KEY (document_id, term_id),
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE
);

CREATE TABLE document_term_frequencies (
    term_id BIGINT PRIMARY KEY,
    document_frequency INTEGER NOT NULL CHECK (document_frequency >= 0),

    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE
);

CREATE INDEX idx_document_terms_term_id ON document_terms(term_id, document_id);
