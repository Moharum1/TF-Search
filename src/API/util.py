from data.Models import TermFrequencyModel, DocumentModel, TermModel
from sqlmodel import Session, select


def convert_keys_to_values(session: Session) -> dict[str, dict[str, int]]:
    """
    Convert a list of TermFrequencyModel instances into a dictionary
    where the keys are document titles and the values are dictionaries
    mapping terms to their frequencies.
    """
    statement = (
        select(DocumentModel, TermModel, TermFrequencyModel)
        .join(TermFrequencyModel, TermFrequencyModel.document_id == DocumentModel.id)
        .join(TermModel, TermFrequencyModel.term_id == TermModel.id)
    )
    documents: dict[str, dict[str, int]] = {}
    for document, term, term_frequency in session.exec(statement):
        documents.setdefault(document.title, {})[term.term] = term_frequency.term_count
    return documents