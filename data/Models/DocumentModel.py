from sqlmodel import SQLModel, Field

class DocumentModel(SQLModel, table=True):
    id : int = Field(default=None, primary_key=True)
    title : str = Field(index=True)
