from fastapi import FastAPI
from contextlib import asynccontextmanager
from tf_search.Dict_maker import TF_IDF

app = FastAPI()

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.search = {}
    yield

@app.post("/api/search")
async def get_relative_recommendation(item : str):
    """
    Compute the TF-IDF score for a given item and return the list
    With items that have the highest TF-IDF scores relative to the input item.
    """


@app.post("/api/InsertDoc")
async def insert_document(document: str):
    """
    Insert a new document into the search index.
    For now the Doc consist of a Dict in the form of {Name, Content}.
    """




