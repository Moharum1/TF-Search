from pydantic import BaseModel

class SearchResultModel(BaseModel):
    title : str
    score : float

class SearchResponseModel(BaseModel):
    total : int
    results : list[SearchResultModel]
