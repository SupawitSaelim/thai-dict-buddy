from typing import Dict, List, Tuple, Optional
import json
from pathlib import Path
from models.word import Word

class DictionaryService:
    def __init__(self, dictionary_path: str = "data/dictionary.json"):
        self.dictionary_path = Path(dictionary_path)
        self.words: Dict[str, str] = {}
        self._load_dictionary()

    def _load_dictionary(self) -> None:
        """Load dictionary from JSON file."""
        if self.dictionary_path.exists():
            try:
                with open(self.dictionary_path, 'r', encoding='utf-8') as f:
                    self.words = json.load(f)
            except json.JSONDecodeError:
                self.words = {}
        else:
            # Create directory if it doesn't exist
            self.dictionary_path.parent.mkdir(parents=True, exist_ok=True)
            self._save_dictionary()

    def _save_dictionary(self) -> None:
        """Save dictionary to JSON file."""
        with open(self.dictionary_path, 'w', encoding='utf-8') as f:
            json.dump(self.words, f, ensure_ascii=False, indent=4)

    def add_word(self, word: Word) -> None:
        """Add a new word to the dictionary."""
        self.words[word.english.lower()] = {
            "thai": word.thai,
            "category": word.category
        }
        self._save_dictionary()

    def get_word(self, english_word: str) -> Optional[Word]:
        """Get a word from the dictionary."""
        word_data = self.words.get(english_word.lower())
        if word_data:
            return Word(
                english=english_word,
                thai=word_data["thai"],
                category=word_data.get("category")
            )
        return None

    def get_all_words(self) -> List[Word]:
        """Get all words from the dictionary."""
        return [
            Word(english=eng, thai=data["thai"], category=data.get("category"))
            for eng, data in self.words.items()
        ]

    def check_translation(self, english_word: str, thai_translation: str) -> Tuple[bool, str]:
        """Check if the Thai translation matches the correct answer."""
        word_data = self.words.get(english_word.lower())
        if not word_data:
            return False, "ไม่พบคำศัพท์นี้ในระบบ"
        
        if word_data["thai"] == thai_translation:
            return True, "ถูกต้อง! 🎉"
        return False, f"ไม่ถูกต้อง คำแปลที่ถูกต้องคือ: {word_data['thai']}"

    def delete_word(self, english_word: str) -> bool:
        """Delete a word from the dictionary."""
        if english_word.lower() in self.words:
            del self.words[english_word.lower()]
            self._save_dictionary()
            return True
        return False

    def update_word(self, word: Word) -> bool:
        """Update an existing word in the dictionary."""
        if word.english.lower() in self.words:
            self.words[word.english.lower()] = {
                "thai": word.thai,
                "category": word.category
            }
            self._save_dictionary()
            return True
        return False

    def get_words_by_category(self, category: str) -> List[Word]:
        """Get all words in a specific category."""
        return [
            Word(english=eng, thai=data["thai"], category=data["category"])
            for eng, data in self.words.items()
            if data.get("category") == category
        ]