import React, { useState, useEffect } from 'react';
import { Check, X, ChevronRight, RotateCw } from 'lucide-react';

const PracticeTab = ({ darkMode, words }) => {
  const [currentWord, setCurrentWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [remainingWords, setRemainingWords] = useState([]);
  const [isReverse, setIsReverse] = useState(false);

  useEffect(() => {
    if (words.length > 0 && remainingWords.length === 0) {
      // Shuffle words when starting new round
      setRemainingWords([...words].sort(() => Math.random() - 0.5));
    }
  }, [words]);

  useEffect(() => {
    if (remainingWords.length > 0 && !currentWord) {
      setCurrentWord(remainingWords[0]);
    }
  }, [remainingWords]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const correctAnswer = isReverse ? currentWord.english : currentWord.thai;
    const submittedAnswer = userAnswer.trim().toLowerCase();
    
    if (submittedAnswer === correctAnswer.trim().toLowerCase()) {
      // Correct answer
      setFeedback({
        type: 'success',
        message: 'ถูกต้อง! 🎉'
      });
      
      // Move to next word after 1.5 seconds
      setTimeout(() => {
        const newRemainingWords = remainingWords.slice(1);
        setRemainingWords(newRemainingWords);
        setCurrentWord(newRemainingWords[0]);
        setUserAnswer('');
        setFeedback(null);
      }, 1500);
    } else {
      // Wrong answer
      setFeedback({
        type: 'error',
        message: `คำตอบที่ถูกต้องคือ: ${correctAnswer}`
      });
    }
  };

  const handleNext = () => {
    const newRemainingWords = remainingWords.slice(1);
    setRemainingWords(newRemainingWords);
    setCurrentWord(newRemainingWords[0]);
    setUserAnswer('');
    setFeedback(null);
  };

  const toggleMode = () => {
    setIsReverse(!isReverse);
    setUserAnswer('');
    setFeedback(null);
  };

  if (!currentWord) {
    return (
      <div className={`text-center py-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <p className="text-xl mb-4">ไม่มีคำศัพท์สำหรับฝึก</p>
        <p>กรุณาเพิ่มคำศัพท์ก่อนเริ่มฝึก</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Mode Toggle and Progress */}
      <div className="flex justify-between items-center">
      <span className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        เหลือ: {remainingWords.length} คำ
      </span>
        <button
          onClick={toggleMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          }`}
        >
          <RotateCw className="w-4 h-4" />
          {isReverse ? 'ไทย → อังกฤษ' : 'อังกฤษ → ไทย'}
        </button>
      </div>

      {/* Question Card */}
      <div className={`p-6 rounded-xl ${
        darkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <h3 className={`text-2xl font-medium text-center mb-8 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {isReverse ? currentWord.thai : currentWord.english}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className={`w-full px-4 py-3 rounded-lg ${
              darkMode 
                ? 'bg-gray-600 border-gray-500 placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder={isReverse ? "พิมพ์คำศัพท์ภาษาอังกฤษ..." : "พิมพ์คำแปลภาษาไทย..."}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={feedback !== null}
            autoFocus
          />
          
          {!feedback && (
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              ตรวจคำตอบ
            </button>
          )}
        </form>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          feedback.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {feedback.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
          {feedback.message}
          {feedback.type === 'error' && (
            <button
              onClick={handleNext}
              className="ml-auto flex items-center gap-2 text-white hover:text-gray-100"
            >
              ข้าม
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeTab;