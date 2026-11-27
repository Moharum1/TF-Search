# TF-Search PR Plan & Roadmap

Each item below is structured as a standalone Pull Request (PR) with its goal, explanation, and implementation checklist.

---

## PR 1: Fix `DataIndexer` Session Handling, Join Bug & Config
**Goal:** Fix existing runtime bugs and remove hardcoded credentials before adding new features.  
**Explanation:** Currently, `src/API/main.py` passes `app.state.engine` into `DataIndexer`, where `index_document` treats it as a `Session` context manager (`with self.db_session as session:`), and `/api/search` joins `DocumentFrequencyModel.id == TermModel.id` instead of `term_id`. Additionally, the PostgreSQL URL is hardcoded instead of using environment variables matching `docker-compose.yml`.
- [ ] Wrap `self.db_session` with `Session(self.db_session)` in `DataIndexer.index_document` (`src/API/DataIndexer.py`).
- [ ] Fix `DocumentFrequencyModel.term_id == TermModel.id` in `src/API/main.py` (or delegate `/api/search` to `DataIndexer.calculate_tf_idf`).
- [ ] Load `DATABASE_URL` (or `POSTGRES_USER` / `POSTGRES_PASSWORD`) via `pydantic-settings` instead of hardcoding credentials in `src/API/main.py`.
- [ ] Fix `main()` in `src/tf_search/__init__.py` to tokenize raw strings with `Term_Frequency` before calling `TF_IDF`.

---

## PR 2: Sorted, Paginated & Structured Search Results
**Goal:** Make `/api/search` return ranked, paginated, and structured results.  
**Explanation:** `/api/search` currently returns an unordered `{title: score}` dictionary that includes `0.0` scores. Real search consumers need results ordered by relevance, with pagination and metadata.
- [ ] Sort search results by descending score and filter out `0.0` scores by default.
- [ ] Add `limit` (`top_k`), `offset`, and `min_score` query parameters to `/api/search`.
- [ ] Return a Pydantic response model (`SearchResponse` with `document_id`, `title`, `score`, `matched_terms`).

---

## PR 3: SQL-Level Inverted Index Querying
**Goal:** Eliminate full-corpus loading on every search request.  
**Explanation:** `convert_keys_to_values(session)` in `src/API/util.py` loads every document and term from PostgreSQL into memory on every query. Filtering `document_terms` by the query's tokenized terms using `idx_document_terms_term_id` (`src/data/Schemas/Schema.sql`) keeps memory usage and latency low as the corpus grows.
- [ ] Add `word_count` to `documents` (`Schema.sql` & `DocumentModel.py`) and populate it at index time.
- [ ] Query only candidate documents containing at least one query term via `document_terms`.
- [ ] Compute TF-IDF over the candidate set instead of calling `convert_keys_to_values`.

---

## PR 4: Unified Tokenizer, Stop-Words & Stemming
**Goal:** Improve text normalization and recall across indexing and querying.  
**Explanation:** `Term_Frequency` in `src/tf_search/Dict_maker.py` uses a basic punctuation `.replace()` loop, which differs from `_tokenize` in `tests/benchmark.py` and misses inflections/noise words. Sharing one analyzer ensures consistent matching.
- [ ] Replace the punctuation loop in `Term_Frequency` with regex tokenization (`\b[\w'-]+\b`) and Unicode normalization.
- [ ] Add optional stop-word filtering.
- [ ] Add optional stemming/lemmatization applied identically at index time and query time.

---

## PR 5: Okapi BM25 Ranking & Title Boosting
**Goal:** Upgrade relevance quality beyond raw TF-IDF.  
**Explanation:** Raw TF-IDF does not saturate term frequency (repeating a word 50 times scales linearly) and ignores `documents.title`. BM25 (`k1`, `b`) and title field boosting significantly improve ranking quality.
- [ ] Implement Okapi BM25 scoring in `src/tf_search/Dict_maker.py` alongside `TF_IDF`.
- [ ] Add L2 normalization / cosine similarity option for fair comparison across document lengths.
- [ ] Tokenize and index `DummyDoc.title` with a configurable boost weight (e.g., `2x` vs. body `content`).

---

## PR 6: Bulk Document Ingestion (Upsert)
**Goal:** Speed up batch indexing and prevent concurrency race conditions.  
**Explanation:** Resolving the `#TODO : Use Bulk Insert` in `src/API/main.py`. Inserting documents one-by-one causes N+1 queries and can fail if two concurrent requests insert the same new term.
- [ ] Add `POST /api/documents/bulk` accepting a list of documents.
- [ ] Use PostgreSQL `INSERT ... ON CONFLICT DO UPDATE` upserts for `terms` and `document_term_frequencies`.
- [ ] Add optional FastAPI `BackgroundTasks` support for large batch ingestion.

---

## PR 7: Full Document CRUD & Metadata Filtering
**Goal:** Support updating, deleting, and filtering indexed documents.  
**Explanation:** Currently documents can only be inserted, not viewed, updated, or deleted. Deleting or updating a document must also decrement `document_term_frequencies` so IDF values stay accurate.
- [ ] Add `GET /api/documents/{id}`, `PUT /api/documents/{id}`, and `DELETE /api/documents/{id}`.
- [ ] Decrement `document_term_frequencies` on update/delete and prune zero-frequency terms.
- [ ] Add optional tags/categories/JSONB metadata to `documents` and support filtering `/api/search` by metadata or `added_at` date ranges.

---

## PR 8: Snippets, Highlighting & Fuzzy/Autocomplete Search
**Goal:** Improve user-facing search experience.  
**Explanation:** Returning only document titles forces users to open each document to see why it matched, and typos currently return zero results.
- [ ] Store raw document text (or a preview) to generate contextual snippets with highlighted query terms.
- [ ] Add `/api/suggest?q=...` for typeahead/autocomplete and typo-tolerant matching using PostgreSQL `pg_trgm` trigram indexes on `terms`.
- [ ] *(Optional)* Store term positions in `document_terms` (`INTEGER[]`) to support exact phrase (`"..."`) and boolean (`AND`/`OR`/`NOT`) queries.

---

## PR 9: Alembic Migrations, Caching, Tests & Observability
**Goal:** Harden the service for production operations.  
**Explanation:** Manual `Schema.sql` execution is error-prone, repeated queries recompute the same IDF/scores, and `tests/` currently only covers pure unit tests (`test_tf_idf.py`) and benchmarks (`benchmark.py`).
- [ ] Set up **Alembic** for versioned database migrations.
- [ ] Add in-memory (LRU) or Redis caching for corpus stats (total docs, IDF) and frequent queries, invalidated on writes.
- [ ] Add FastAPI `TestClient` integration tests for `DataIndexer` and all API endpoints, plus relevance metrics (Precision@K, MRR, NDCG).
- [ ] Add structured logging, request timing middleware, and a `/health` endpoint checking PostgreSQL connectivity.

---

## PR 10: Hybrid Search & Web UI *(Future)*
**Goal:** Combine lexical search with semantic embeddings and provide an interactive UI.  
**Explanation:** TF-IDF/BM25 excels at exact keywords, while vector embeddings capture semantic meaning. Combining both via Reciprocal Rank Fusion (RRF) and adding a simple UI makes the engine easy to demo and use.
- [ ] Add `pgvector` support to store document embeddings and combine lexical + vector scores with RRF.
- [ ] Add a lightweight web UI (served by FastAPI) for uploading documents, running searches, and inspecting scores.
- [ ] Add multi-collection/namespace support so multiple datasets can be indexed and searched independently.
