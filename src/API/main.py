from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
from sqlmodel import Session, create_engine, select
from data.Models import TermFrequencyModel, DocumentModel, TermModel, DummyDoc, DocumentFrequencyModel, SearchResponseModel, SearchResultModel
from tf_search.Dict_maker import TF_IDF, Term_Frequency
from API.util import convert_keys_to_values
from API.config import settings
from API.DataIndexer import DataIndexer


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.engine = create_engine(
        settings.db_url,
        echo=settings.db_echo  
    )
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/api/search")
async def get_relative_recommendation(item : str, 
        limit: int = 5, offset: int = 0, min_score : float = 0.01
    ) -> SearchResponseModel:
    """
    Compute the TF-IDF score for a given item and return the list
    With items that have the highest TF-IDF scores relative to the input item.
    """
    with Session(app.state.engine) as session:
        # Perform the search logic here
        data = convert_keys_to_values(session)
        DF = session.exec(select(
            DocumentFrequencyModel.document_frequency, TermModel.term
        ).join(TermModel, DocumentFrequencyModel.term_id == TermModel.id)).all()
        DF = {row.term: row.document_frequency for row in DF}

        scores = TF_IDF(item, list(data.values()), DF)
        matched = [
            (title, score)
            for title, score in zip(data.keys(), scores)
            if score >= min_score
        ]
        matched.sort(key=lambda x: (-x[1], x[0]))

        page = matched[offset : offset + limit]
        return SearchResponseModel(
            total=len(matched),
            results=[
                SearchResultModel(title=title, score=score) for title, score in page
            ],
        )


#TODO : Use Bulk Insert to insert the data into the database
#TODO : Use Database Indexing to speed up the search process
@app.post("/api/InsertDoc")
async def insert_document(document: DummyDoc):
    """
    Insert a new document into the search index.
    For now the Doc consist of a Dict in the form of {Name, Content}.
    """
    result = DataIndexer(app.state.engine).index_document(document)
    return result



@app.get("/api/GetTFIndexes")
async def get_tf_indexes():
    """
    Retrieve the current TF indexes for all documents in the search index.
    """
    with Session(app.state.engine) as session:
        # Assuming you have a TermFrequencyModel defined in your models
        return convert_keys_to_values(session)

