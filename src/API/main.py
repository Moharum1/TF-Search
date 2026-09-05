from fastapi import FastAPI
from contextlib import asynccontextmanager
from pydantic import BaseModel
from sqlmodel import Session, create_engine, select
from data.Models import TermFrequencyModel, DocumentModel, TermModel, DummyDoc
from tf_search.Dict_maker import TF_IDF, Term_Frequency


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.engine = create_engine(
        "postgresql+psycopg://12345:12345@localhost:5432/tfidf", echo=True
    )
    yield

app = FastAPI(lifespan=lifespan)


@app.post("/api/search")
async def get_relative_recommendation(item : str):
    """
    Compute the TF-IDF score for a given item and return the list
    With items that have the highest TF-IDF scores relative to the input item.
    """
    TF_IDF_scores = TF_IDF(item, list(app.state.search.values()))
    return TF_IDF_scores


#TODO : Use Bulk Insert to insert the data into the database
#TODO : Use Database Indexing to speed up the search process
@app.post("/api/InsertDoc")
async def insert_document(document: DummyDoc):
    """
    Insert a new document into the search index.
    For now the Doc consist of a Dict in the form of {Name, Content}.
    """
    with Session(app.state.engine) as session:
        DocModel = DocumentModel(title=document.title)
        session.add(DocModel)
        session.flush()  # Flush to get the document ID

        term_freq = Term_Frequency(document.content)

        for word, freq in term_freq.items():
            term = session.exec(select(TermModel).where(TermModel.term == word)).first()
            if not term:
                term = TermModel(term=word)
                session.add(term)
                session.flush()

            session.add(
                TermFrequencyModel(
                    term_id=term.id, document_id=DocModel.id, term_count=freq
                )
            )
        session.commit()


@app.get("/api/GetTFIndexes")
async def get_tf_indexes():
    """
    Retrieve the current TF indexes for all documents in the search index.
    """
    with Session(app.state.engine) as session:
        # Assuming you have a TermFrequencyModel defined in your models
        tf_indexes = session.exec(select(TermFrequencyModel)).all()
        return tf_indexes

