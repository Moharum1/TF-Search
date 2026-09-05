CREATE TABLE documents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL UNIQUE,
    added_at TIMESTAMP NOT NULL DEFAULT current_timestamp
);

CREATE TABLE terms (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    term TEXT NOT NULL UNIQUE
);

CREATE TABLE document_terms (
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
    term_count INTEGER NOT NULL CHECK (term_count >= 0),
    PRIMARY KEY (document_id, term_id)
);