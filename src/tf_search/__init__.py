"""TF-Search package."""

from .Dict_maker import Term_Frequency, Domain_Frequency, TF, IDF, TF_IDF


def main() -> None:
    """Entry point for the TF-Search application."""
    content = [
        "cat dog cat",
        "dog mouse",
        "mouse cat dog",
    ]

    print("TF-IDF for Cat", TF_IDF("cat", content))

__all__ = ["Term_Frequency", "Domain_Frequency", "TF", "IDF", "TF_IDF", "main"]
