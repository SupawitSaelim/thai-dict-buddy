import React, { useState, useEffect } from 'react';
import { Check, X, ChevronRight, RotateCw } from 'lucide-react';

const QuizTab = ({ darkMode, words }) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [remainingWords, setRemainingWords] = useState([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    if (words.length > 0 && remainingWords.length === 0) {
      // เริ่มเกมใหม่
      setRemainingWords([...words].sort(() => Math.random() - 0.5));
      setScore(0);
      setTotalQuestions(0);
    }
  }, [words]);

  useEffect(() => {
    if (remainingWords.length > 0 && !currentQuestion) {
      generateNewQuestion();
    }
  }, [remainingWords]);

  const generateNewQuestion = () => {
    const word = remainingWords[0];
    
    // สร้างตัวเลือก 4 ข้อ
    const otherWords = words.filter(w => w.english !== word.english);
    const wrongAnswers = otherWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.thai);
    
    // รวมคำตอบที่ถูกและสลับตำแหน่ง
    const allChoices = [...wrongAnswers, word.thai]
      .sort(() => Math.random() - 0.5)
      .map((choice, index) => ({
        id: index,
        text: choice,
        isCorrect: choice === word.thai
      }));

    setCurrentQuestion(word);
    setChoices(allChoices);
    setFeedback(null);
  };

  const handleAnswer = (choice) => {
    if (feedback) return; // ป้องกันการกดซ้ำระหว่างแสดงผลลัพธ์

    setTotalQuestions(prev => prev + 1);
    
    if (choice.isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({
        type: 'success',
        message: 'ถูกต้อง! 🎉'
      });
    } else {
      setFeedback({
        type: 'error',
        message: `ไม่ถูกต้อง คำตอบที่ถูกต้องคือ: ${currentQuestion.thai}`
      });
    }

    // แสดงผลลัพธ์ 1.5 วินาทีก่อนไปข้อต่อไป
    setTimeout(() => {
      const newRemainingWords = remainingWords.slice(1);
      setRemainingWords(newRemainingWords);
      setCurrentQuestion(null);
      setFeedback(null);
    }, 1500);
  };

  const restartQuiz = () => {
    setRemainingWords([...words].sort(() => Math.random() - 0.5));
    setScore(0);
    setTotalQuestions(0);
    setCurrentQuestion(null);
    setFeedback(null);
  };

  if (!currentQuestion) {
    return (
      <div className={`text-center py-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {words.length === 0 ? (
          <>
            <p className="text-xl mb-4">ไม่มีคำศัพท์สำหรับทำแบบทดสอบ</p>
            <p>กรุณาเพิ่มคำศัพท์ก่อนเริ่มทำแบบทดสอบ</p>
          </>
        ) : (
          <>
            <p className="text-xl mb-4">เริ่มทำแบบทดสอบ</p>
            <button
              onClick={restartQuiz}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              เริ่มใหม่
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Score Display */}
      <div className="flex justify-between items-center">
        <span className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          คะแนน: {score}/{totalQuestions}
        </span>
        <span className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          เหลือ: {remainingWords.length} ข้อ
        </span>
      </div>

      {/* Question Card */}
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <h3 className={`text-2xl font-medium text-center mb-8 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          "{currentQuestion.english}" แปลว่าอะไร?
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleAnswer(choice)}
              disabled={!!feedback}
              className={`p-4 text-lg rounded-lg transition-all ${
                feedback
                  ? choice.isCorrect
                    ? 'bg-green-500 text-white'
                    : feedback.type === 'error' && choice.text === currentQuestion.thai
                    ? 'bg-green-500 text-white'
                    : darkMode
                    ? 'bg-gray-600 text-gray-300'
                    : 'bg-gray-100 text-gray-500'
                  : darkMode
                  ? 'bg-gray-600 hover:bg-gray-500 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
              }`}
            >
              {choice.text}
            </button>
          ))}
        </div>
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
        </div>
      )}
    </div>
  );
};

export default QuizTab;