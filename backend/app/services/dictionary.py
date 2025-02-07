from typing import Dict, List, Tuple, Optional
import json
from pathlib import Path
from models.word import Word
import os

class DictionaryService:
    """Service class for managing the dictionary operations."""

    def __init__(self, dictionary_path: str = None):
        """
        Initialize dictionary service.
        
        Args:
            dictionary_path: Optional custom path to dictionary file
        """
        if dictionary_path is None:
            # Get the directory where the current file (dictionary.py) is located
            current_dir = Path(os.path.dirname(os.path.abspath(__file__)))
            # Go up one level to the app root directory and then into data
            self.dictionary_path = current_dir.parent.parent / "data" / "dictionary.json"
        else:
            self.dictionary_path = Path(dictionary_path)
            
        self.words: Dict[str, Dict[str, str]] = {}
        self._load_dictionary()

    def _normalize_key(self, text: str) -> str:
        """
        Normalize text for use as dictionary key.
        
        Args:
            text: Text to normalize
            
        Returns:
            Normalized text suitable for use as dictionary key
        """
        return ' '.join(text.strip().lower().split())
        
    def _load_dictionary(self) -> None:
        """Load dictionary from JSON file."""
        if self.dictionary_path.exists():
            try:
                with open(self.dictionary_path, 'r', encoding='utf-8') as f:
                    self.words = json.load(f)
            except json.JSONDecodeError as e:
                print(f"Error loading dictionary: {e}")
                self.words = {}
        else:
            print(f"Dictionary file not found at: {self.dictionary_path}")
            # Create directory if it doesn't exist
            self.dictionary_path.parent.mkdir(parents=True, exist_ok=True)
            self._save_dictionary()

    def _save_dictionary(self) -> None:
        """Save dictionary to JSON file."""
        with open(self.dictionary_path, 'w', encoding='utf-8') as f:
            json.dump(self.words, f, ensure_ascii=False, indent=4)

    def add_word(self, word: Word) -> None:
        """
        Add a new word to the dictionary.
        
        Args:
            word: Word object containing english and thai translations
            
        Raises:
            ValueError: If the word already exists in the dictionary
        """
        # Normalize the word for comparison and storage
        normalized_word = self._normalize_key(word.english)
        
        # Check if word already exists
        if normalized_word in self.words:
            raise ValueError(f"คำว่า '{word.english}' มีอยู่ในระบบแล้ว")
        
        # Add the word with normalized data
        self.words[normalized_word] = {
            "thai": ' '.join(word.thai.split()),  # Normalize thai translation
            "category": ' '.join(word.category.split()) if word.category else None
        }
        self._save_dictionary()

    def get_word(self, english_word: str) -> Optional[Word]:
        """
        Get a word from the dictionary.
        
        Args:
            english_word: English word to retrieve
            
        Returns:
            Word object if found, None otherwise
        """
        normalized_word = self._normalize_key(english_word)
        word_data = self.words.get(normalized_word)
        
        if word_data:
            return Word(
                english=normalized_word,
                thai=word_data["thai"],
                category=word_data.get("category")
            )
        return None

    def get_all_words(self) -> List[Word]:
        """
        Get all words from the dictionary.
        
        Returns:
            List of all Word objects in the dictionary
        """
        return [
            Word(english=eng, thai=data["thai"], category=data.get("category"))
            for eng, data in self.words.items()
        ]

    def check_translation(self, english_word: str, thai_translation: str) -> Tuple[bool, str]:
        """
        Check if the Thai translation matches the correct answer.
        
        Args:
            english_word: English word to check
            thai_translation: Thai translation to verify
            
        Returns:
            Tuple of (is_correct, message)
        """
        normalized_word = self._normalize_key(english_word)
        normalized_translation = ' '.join(thai_translation.split())
        word_data = self.words.get(normalized_word)
        
        if not word_data:
            return False, "ไม่พบคำศัพท์นี้ในระบบ"
        
        if word_data["thai"] == normalized_translation:
            return True, "ถูกต้อง! 🎉"
        return False, f"ไม่ถูกต้อง คำแปลที่ถูกต้องคือ: {word_data['thai']}"

    def delete_word(self, english_word: str) -> bool:
        """
        Delete a word from the dictionary.
        
        Args:
            english_word: English word to delete
            
        Returns:
            True if word was deleted, False if word was not found
        """
        normalized_word = self._normalize_key(english_word)
        if normalized_word in self.words:
            del self.words[normalized_word]
            self._save_dictionary()
            return True
        return False

    def update_word(self, word: Word) -> bool:
        """
        Update an existing word in the dictionary.
        
        Args:
            word: Word object with updated information
            
        Returns:
            True if word was updated, False if word was not found
        """
        normalized_word = self._normalize_key(word.english)
        
        if normalized_word in self.words:
            self.words[normalized_word] = {
                "thai": ' '.join(word.thai.split()),
                "category": ' '.join(word.category.split()) if word.category else None
            }
            self._save_dictionary()
            return True
        return False

    def get_words_by_category(self, category: str) -> List[Word]:
        """
        Get all words in a specific category.
        
        Args:
            category: Category to filter by
            
        Returns:
            List of Word objects in the specified category
        """
        normalized_category = ' '.join(category.split())
        return [
            Word(english=eng, thai=data["thai"], category=data["category"])
            for eng, data in self.words.items()
            if data.get("category") == normalized_category
        ]
    
    def sort_words(self, sort_by: str) -> List[Word]:
        """
        Sort words by specified field and save to dictionary.
        
        Args:
            sort_by: Field to sort by ('english', 'thai', or 'category')
            
        Returns:
            List of sorted Word objects
            
        Raises:
            ValueError: If invalid sort field is provided
        """
        if sort_by not in ['english', 'thai', 'category']:
            raise ValueError("Invalid sort field. Must be 'english', 'thai', or 'category'")
        
        # Get all words
        words = self.get_all_words()
        
        # Sort words based on field
        words.sort(key=lambda x: getattr(x, sort_by) or "")
        
        # Convert sorted words back to dictionary format and save
        sorted_dict = {}
        for word in words:
            normalized_word = self._normalize_key(word.english)
            sorted_dict[normalized_word] = {
                "thai": ' '.join(word.thai.split()),
                "category": ' '.join(word.category.split()) if word.category else None
            }
        
        # Update the instance dictionary and save
        self.words = sorted_dict
        self._save_dictionary()
        
        return words