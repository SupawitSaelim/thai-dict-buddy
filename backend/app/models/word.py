import re
from pydantic import BaseModel, validator

class Word(BaseModel):
    """
    Model representing a word in the dictionary.
    
    Attributes:
        english: The English word
        thai: Thai translation of the word
        category: Optional category of the word
    """
    english: str
    thai: str
    category: str | None = None

    @validator('english')
    def validate_english(cls, v: str) -> str:
        """
        Validate and normalize English word.
        
        Args:
            v: The English word to validate
            
        Returns:
            str: Normalized English word
            
        Raises:
            ValueError: If word is empty or contains invalid characters
        """
        # Trim outer spaces but keep internal spaces and hyphens
        v = v.strip()
        
        # Check if string is empty after trimming
        if not v:
            raise ValueError("คำศัพท์ภาษาอังกฤษห้ามเป็นช่องว่าง")
            
        # Check if contains only valid characters
        # Allow letters, numbers, spaces, hyphens, and ampersands
        if not re.match(r'^[a-zA-Z0-9\s\-&]+$', v):
            raise ValueError("คำศัพท์ภาษาอังกฤษต้องประกอบด้วยตัวอักษร ตัวเลข เครื่องหมายขีด (-) และ (&) เท่านั้น")
            
        # Normalize internal spaces (convert multiple spaces to single space)
        v = ' '.join(v.split())
        
        return v

    @validator('thai')
    def validate_thai(cls, v: str) -> str:
        """
        Validate and normalize Thai translation.
        
        Args:
            v: The Thai translation to validate
            
        Returns:
            str: Normalized Thai translation
            
        Raises:
            ValueError: If translation is empty
        """
        v = v.strip()
        if not v:
            raise ValueError("คำแปลภาษาไทยห้ามเป็นช่องว่าง")
        # Normalize internal spaces
        return ' '.join(v.split())

    @validator('category')
    def validate_category(cls, v: str | None) -> str | None:
        """
        Validate and normalize category.
        
        Args:
            v: The category to validate
            
        Returns:
            str | None: Normalized category or None if empty
        """
        if v is not None:
            v = v.strip()
            if v:
                # Normalize internal spaces if category is not empty
                return ' '.join(v.split())
            return None
        return v