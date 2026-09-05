from sqlmodel import SQLModel, Field
from data.Models import DocumentModel, TermModel

class TermFrequencyModel(SQLModel, table=True):
    __tablename__ = "document_terms"

    term_id: int = Field(foreign_key="terms.id", primary_key=True)
    document_id: int = Field(foreign_key="documents.id", primary_key=True)
    term_count: int