from sqlmodel import SQLModel, Field
from pydantic import BaseModel


class DocumentModel(SQLModel, table=True):
    __tablename__ = "documents"

    id: int = Field(default=None, primary_key=True)
    title: str = Field(index=True)


class DummyDoc(BaseModel):
    title: str
    content: str