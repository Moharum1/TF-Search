from sqlmodel import Session, select
from data.Models import DocumentModel, TermModel, TermFrequencyModel, DocumentFrequencyModel
from tf_search.Dict_maker import Term_Frequency
from API.util import convert_keys_to_values
from tf_search.Dict_maker import TF_IDF, Term_Frequency

class DataIndexer:
    def __init__(self, db_session):
        self.db_session = db_session

        def index_document(self, document):
            """
            Index a single document by calculating term frequencies and updating the database.
            """
            try :
                with Session(db_session) as session:
                    DocModel = DocumentModel(title=document.title)
                    session.add(DocModel)
                    session.flush()  # Flush to get the document ID

                    term_freq = Term_Frequency(document.content)

                    for word, freq in term_freq.items():
                        term = session.exec(select(TermModel).where(TermModel.term == word)).first()
                        df = session.exec(select(DocumentFrequencyModel).where(DocumentFrequencyModel.term_id == term.id)).first() if term else None
                        if not term:
                            term = TermModel(term=word)

                            session.add(term)
                            session.flush()

                        if not df:
                            session.add(DocumentFrequencyModel(term_id=term.id, document_frequency=1))
                        else:
                            df.document_frequency += 1

                        session.add(
                            TermFrequencyModel(
                                term_id=term.id, document_id=DocModel.id, term_count=freq
                            ),
                        )
                    session.commit()
                    return {"message": "Document indexed successfully."}
            except Exception as e:
                print(f"Error indexing document: {e}")
                return {"error": "An error occurred while indexing the document."}

    def calculate_tf_idf(self, query: str):
        """
        Calculate the TF-IDF scores for a given query across all indexed documents.
        """
        with Session(self.db_session) as session:
            documents = convert_keys_to_values(session)
            DF = session.exec(select(
                DocumentFrequencyModel.document_frequency, TermModel.term
            ).join(TermModel, DocumentFrequencyModel.term_id == TermModel.id)).all()
            DF = {row.term: row.document_frequency for row in DF}

            tf_idf_scores = TF_IDF(query, list(documents.values()), DF)
            return {doc_title: score for doc_title, score in zip(documents.keys(), tf_idf_scores)}
