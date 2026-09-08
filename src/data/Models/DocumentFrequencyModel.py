from sqlmodel import SQLModel, Field

class DocumentFrequencyModel(SQLModel, table=True):
    __tablename__ = "document_term_frequencies"

    term_id : int = Field(default=None, primary_key=True)
    document_frequency : int                        