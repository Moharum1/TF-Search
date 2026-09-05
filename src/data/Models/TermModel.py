from sqlmodel import SQLModel, Field


class TermModel(SQLModel, table=True):
    __tablename__ = "terms"

    id: int = Field(default=None, primary_key=True)
    term: str = Field(index=True)