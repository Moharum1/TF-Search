from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    postgres_user : str
    postgres_pass : str
    postgres_host : str  = "localhost"
    postgres_port : int  = 5432
    postgres_db   : str  = "tfidf"
    db_echo       : bool = False
    
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8"
    )

    @property
    def db_url(self) -> str:
        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_pass}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"

settings = Settings()