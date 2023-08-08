from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGODB_CONN_STR: str

    # specify .env file location as Config attribute
    class Config:
        env_file = ".env"


# global instance
settings = Settings()
