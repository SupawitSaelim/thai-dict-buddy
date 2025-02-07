from pydantic import BaseModel

class Word(BaseModel):
    english: str
    thai: str
    category: str | None = None