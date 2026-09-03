from fastapi import FastAPI
from contextlib import asynccontextmanager
from pydantic import BaseModel
from tf_search.Dict_maker import TF_IDF, Term_Frequency

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.search = {}
    yield

app = FastAPI(lifespan=lifespan)


@app.post("/api/search")
async def get_relative_recommendation(item : str):
    """
    Compute the TF-IDF score for a given item and return the list
    With items that have the highest TF-IDF scores relative to the input item.
    """

class TFIDFDoc(BaseModel):
    title: str
    content: str

@app.post("/api/InsertDoc")
async def insert_document(document: TFIDFDoc):
    """
    Insert a new document into the search index.
    For now the Doc consist of a Dict in the form of {Name, Content}.
    """
    app.state.search[document.title] = Term_Frequency(document.content)
    return {
        "message" : "Document Inserted Successfully"
    }


@app.get("/api/GetTFIndexes")
async def get_tf_indexes():
    """
    Retrieve the current TF indexes for all documents in the search index.
    """
    return app.state.search

