from sqlmodel import SQLModel, Field
from data.Models import DocumentModel, TermModel

class TermFrequencyModel(SQLModel, table=True):
    id : int = Field(default=None, primary_key=True)
    term_id : int = Field(foreign_key=TermModel.id)
    document_id : int = Field(foreign_key=DocumentModel.id)
    frequency : int