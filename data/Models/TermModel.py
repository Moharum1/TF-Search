from sqlmodel import SQLModel, Field

class TermModel(SQLModel, table=True):
    id : int = Field(default=None, primary_key=True)
    term : str = Field(index=True)