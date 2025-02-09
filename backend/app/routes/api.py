from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Dict
from models.word import Word
from services.dictionary import DictionaryService

router = APIRouter()

class WordImport(BaseModel):
    words: List[Word]

# Dependency
def get_dictionary_service():
    return DictionaryService()

@router.post("/words/", response_model=Dict[str, str])
async def add_word(word: Word, dictionary: DictionaryService = Depends(get_dictionary_service)):
    """Add a new word to the dictionary."""
    try:
        dictionary.add_word(word)
        return {"message": f"เพิ่มคำว่า '{word.english}' เรียบร้อยแล้ว"}
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/words/", response_model=List[Word])
async def get_all_words(dictionary: DictionaryService = Depends(get_dictionary_service)):
    """Get all words from the dictionary."""
    return dictionary.get_all_words()

@router.post("/words/bulk", response_model=Dict[str, str])
async def import_words(
    data: WordImport,
    dictionary: DictionaryService = Depends(get_dictionary_service)
):
    """Import multiple words at once."""
    try:
        added = 0
        skipped = 0
        
        for word in data.words:
            try:
                dictionary.add_word(word)
                added += 1
            except ValueError:
                skipped += 1
                continue
        
        return {
            "message": f"นำเข้าข้อมูลสำเร็จ {added} คำ (ข้ามไป {skipped} คำที่มีอยู่แล้ว)"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/words/search", response_model=List[Word])
async def search_words(
    term: str = Query(..., description="Search term for filtering words"),
    dictionary: DictionaryService = Depends(get_dictionary_service)
):
    """
    Search words by term. Matches partial words in english, thai, and category fields.
    """
    try:
        return dictionary.search_words(term)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/words/{english_word}", response_model=Word)
async def get_word(english_word: str, dictionary: DictionaryService = Depends(get_dictionary_service)):
    """Get a specific word from the dictionary."""
    word = dictionary.get_word(english_word)
    if not word:
        raise HTTPException(status_code=404, detail="ไม่พบคำศัพท์นี้")
    return word

@router.post("/check-translation/")
async def check_translation(english_word: str, thai_translation: str, 
                          dictionary: DictionaryService = Depends(get_dictionary_service)):
    """Check if the Thai translation is correct."""
    is_correct, message = dictionary.check_translation(english_word, thai_translation)
    return {
        "is_correct": is_correct,
        "message": message
    }

@router.put("/words/{english_word}", response_model=Dict[str, str])
async def update_word(english_word: str, word: Word, 
                     dictionary: DictionaryService = Depends(get_dictionary_service)):
    """Update an existing word."""
    if english_word.lower() != word.english.lower():
        raise HTTPException(status_code=400, detail="คำศัพท์ไม่ตรงกับที่ต้องการอัพเดท")
    
    if dictionary.update_word(word):
        return {"message": f"อัพเดทคำว่า '{word.english}' เรียบร้อยแล้ว"}
    raise HTTPException(status_code=404, detail="ไม่พบคำศัพท์นี้")

@router.delete("/words/{english_word}", response_model=Dict[str, str])
async def delete_word(english_word: str, dictionary: DictionaryService = Depends(get_dictionary_service)):
    """Delete a word from the dictionary."""
    if dictionary.delete_word(english_word):
        return {"message": f"ลบคำว่า '{english_word}' เรียบร้อยแล้ว"}
    raise HTTPException(status_code=404, detail="ไม่พบคำศัพท์นี้")

@router.get("/words/category/{category}", response_model=List[Word])
async def get_words_by_category(category: str, dictionary: DictionaryService = Depends(get_dictionary_service)):
    """Get all words in a specific category."""
    return dictionary.get_words_by_category(category)

@router.post("/words/sort/", response_model=List[Word])
async def sort_words(
    sort_by: str,
    dictionary: DictionaryService = Depends(get_dictionary_service)
):
    """Sort all words by specified field and save to dictionary."""
    try:
        sorted_words = dictionary.sort_words(sort_by)
        return sorted_words
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/words/", response_model=Dict[str, str])
async def delete_all_words(dictionary: DictionaryService = Depends(get_dictionary_service)):
    """Delete all words from the dictionary."""
    try:
        dictionary.delete_all_words()  # ต้องเพิ่มเมธอดนี้ใน DictionaryService
        return {"message": "ลบคำศัพท์ทั้งหมดเรียบร้อยแล้ว"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

