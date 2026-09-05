from data.Models import TermFrequencyModel, DocumentModel, TermModel
from sqlmodel import Session, create_engine


def convert_keys_to_values(tf_index: list[TermFrequencyModel]) -> dict[str, dict[str, int]]:
    """
    Convert a list of TermFrequencyModel instances into a dictionary
    where the keys are document titles and the values are dictionaries
    mapping terms to their frequencies.
    """
    engine = create_engine(
        "postgresql+psycopg://12345:12345@localhost:5432/tfidf", echo=True
    )
    result: dict[str, dict[str, int]] = {}
    with Session(engine) as session:
        for tf in tf_index:
            document = session.get(DocumentModel, tf.document_id)
            term = session.get(TermModel, tf.term_id)
            if document and term:
                if document.title not in result:
                    result[document.title] = {}
                result[document.title][term.term] = tf.term_count
    return result