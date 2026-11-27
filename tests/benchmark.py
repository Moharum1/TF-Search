import re
import statistics
import time
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from tf_search.Dict_maker import TF_IDF


def _tokenize(text: str) -> list[str]:
    return re.findall(r"\b[\w'-]+\b", text.lower())


def _as_term_counts(documents: list[str]) -> list[dict[str, int]]:
    return [Counter(_tokenize(doc)) for doc in documents]


def benchmark_custom_tfidf(documents: list[str], query: str) -> list[float]:
    """Run the project TF-IDF implementation against a document set."""
    return TF_IDF(query, _as_term_counts(documents))


def benchmark_sklearn_tfidf(documents: list[str], query: str) -> list[float]:
    """Run scikit-learn's TfidfVectorizer for the same dataset and query."""
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)
    query_vector = vectorizer.transform([query])
    scores = (tfidf_matrix @ query_vector.T).toarray().ravel()
    return scores.tolist()


def benchmark_tfidf(texts, query):
    """Backward-compatible benchmark wrapper using the scikit-learn implementation."""
    return benchmark_sklearn_tfidf(texts, query)


def benchmark_tfidf_single(texts, query):
    """Backward-compatible single-run wrapper for the project implementation."""
    return benchmark_custom_tfidf(texts, query)


def _measure(fn, *args, repeats=25):
    timings = []
    for _ in range(repeats):
        start = time.perf_counter()
        fn(*args)
        timings.append(time.perf_counter() - start)
    return {
        "min": min(timings),
        "median": statistics.median(timings),
        "mean": statistics.mean(timings),
        "max": max(timings),
    }


def build_documents(size: int = 500) -> list[str]:
    topics = [
        "machine learning model training data features accuracy", 
        "python code benchmark performance latency optimization",
        "search indexing engine documents queries rank relevance",
        "database sql query performance indexing caching",
        "natural language processing embeddings vectors semantic",
        "computer vision image recognition detection segmentation",
        "cloud deployment kubernetes docker services scalability",
        "statistics probability variance distribution confidence",
    ]

    documents = []
    for i in range(size):
        topic = topics[i % len(topics)]
        extra = f"document {i} {topic} " * (i % 4 + 1)
        documents.append(f"{topic} {extra}")
    return documents


def run_comparison():
    query = "search indexing documents query relevance ranking"
    documents = build_documents(500)

    custom_result = benchmark_custom_tfidf(documents, query)
    sklearn_result = benchmark_sklearn_tfidf(documents, query)

    custom_stats = _measure(benchmark_custom_tfidf, documents, query)
    sklearn_stats = _measure(benchmark_sklearn_tfidf, documents, query)

    print("TF-IDF Benchmark Comparison")
    print("=" * 80)
    print(f"Documents: {len(documents)}")
    print(f"Query: {query}")
    print()
    print(f"Custom TF-IDF result sample: {custom_result[:5]}")
    print(f"Sklearn TF-IDF result sample: {sklearn_result[:5]}")
    print()
    print("Timing (seconds, averaged over 25 runs)")
    print("-" * 80)
    print(f"Custom TF-IDF: mean={custom_stats['mean']:.6f}s median={custom_stats['median']:.6f}s min={custom_stats['min']:.6f}s max={custom_stats['max']:.6f}s")
    print(f"Sklearn TF-IDF: mean={sklearn_stats['mean']:.6f}s median={sklearn_stats['median']:.6f}s min={sklearn_stats['min']:.6f}s max={sklearn_stats['max']:.6f}s")

    faster = "custom" if custom_stats['mean'] < sklearn_stats['mean'] else "sklearn"
    speedup = max(custom_stats['mean'], sklearn_stats['mean']) / min(custom_stats['mean'], sklearn_stats['mean'])
    print(f"Faster implementation: {faster} ({speedup:.2f}x on the mean timing)")


if __name__ == "__main__":
    run_comparison()
