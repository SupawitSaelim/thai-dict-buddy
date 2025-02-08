import React, { useState, useEffect } from 'react';
import { Search, Plus, Book, Moon, Sun, AlertCircle, GraduationCap, HelpCircle, Info, Bookmark } from 'lucide-react';
import SearchTab from './SearchTab';
import AddEditTab from './AddEditTab';
import ListTab from './ListTab';
import PracticeTab from './PracticeTab';
import QuizTab from './QuizTab';

const API_BASE_URL = import.meta.env.PROD 
  ? 'http://localhost:8000/api/v1'  // Production URL
  : 'http://localhost:8000/api/v1';

const DictionaryApp = () => {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState({ english: '', thai: '', category: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('search');
  const [editingWord, setEditingWord] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async (sortBy = null) => {
    setIsLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/words/`);
      if (sortBy) {
        url.searchParams.append('sort_by', sortBy);
      }
      const response = await fetch(url);
      const data = await response.json();
      setWords(data);
    } catch (error) {
      showMessage('error', 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = async (field) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/words/sort/?sort_by=${field}`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setWords(data);
        showMessage('success', 'เรียงลำดับข้อมูลเรียบร้อย');
      } else {
        const errorData = await response.json();
        showMessage('error', errorData.detail || 'เกิดข้อผิดพลาดในการเรียงลำดับ');
      }
    } catch (error) {
      showMessage('error', 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSearch = async (searchValue = searchTerm) => {
    try {
      if (!searchValue.trim()) {
        fetchWords();
        return;
      }

      const response = await fetch(`${API_BASE_URL}/words/search?term=${encodeURIComponent(searchValue)}`);
      if (response.ok) {
        const data = await response.json();
        setWords(data);
      } else {
        setWords([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setWords([]);
    }
  }

  const handleDelete = async (english) => {
    try {
      const response = await fetch(`${API_BASE_URL}/words/${english}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        setWords(prevWords => prevWords.filter(word => word.english !== english));
        showMessage('success', 'ลบคำศัพท์เรียบร้อยแล้ว');
      } else {
        showMessage('error', 'เกิดข้อผิดพลาดในการลบคำศัพท์');
      }
    } catch (error) {
      showMessage('error', 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    }
  };

  const handleEdit = (word) => {
    setEditingWord(word);
    setNewWord({
      english: word.english,
      thai: word.thai,
      category: word.category || ''
    });
    setActiveTab('add');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let response;
      if (editingWord) {
        response = await fetch(`${API_BASE_URL}/words/${editingWord.english}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newWord),
        });
      } else {
        response = await fetch(`${API_BASE_URL}/words/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newWord),
        });
      }

      const data = await response.json();
      
      if (response.ok) {
        showMessage('success', editingWord ? 'แก้ไขคำศัพท์เรียบร้อยแล้ว' : 'เพิ่มคำศัพท์เรียบร้อยแล้ว');
        setNewWord({ english: '', thai: '', category: '' });
        setEditingWord(null);
        fetchWords();
        setActiveTab('list');
      } else {
        if (response.status === 409) {
          showMessage('error', data.detail);
        } else {
          showMessage('error', data.detail || 'เกิดข้อผิดพลาด');
        }
      }
    } catch (error) {
      showMessage('error', 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <span>Thai Dict Buddy 📚</span>
            <p>v1.0</p>
          </h1>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/SupawitSaelim"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Info className="w-6 h-6" />
            </a>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'search', label: 'ค้นหาคำศัพท์', icon: Search },
            { id: 'add', label: editingWord ? 'แก้ไขคำศัพท์' : 'เพิ่มคำศัพท์', icon: Plus },
            { id: 'list', label: 'รายการคำศัพท์', icon: Book },
            { id: 'practice', label: 'ฝึกคำศัพท์', icon: GraduationCap },
            { id: 'quiz', label: 'แบบทดสอบ', icon: HelpCircle }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActiveTab(id);
                if (id !== 'add') {
                  setEditingWord(null);
                  setNewWord({ english: '', thai: '', category: '' });
                }
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === id
                  ? 'bg-blue-500 text-white shadow-lg scale-105'
                  : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'hover:bg-white hover:shadow hover:text-gray-900'}`
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className={`rounded-xl p-6 mb-6 ${
          darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
        }`}>
          {activeTab === 'search' && (
            <SearchTab
              darkMode={darkMode}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSearch={handleSearch}
              words={words}
            />
          )}

          {activeTab === 'add' && (
            <AddEditTab
              darkMode={darkMode}
              handleSubmit={handleSubmit}
              newWord={newWord}
              setNewWord={setNewWord}
              editingWord={editingWord}
              setEditingWord={setEditingWord}
              showMessage={showMessage}  // เพิ่มใหม่
              fetchWords={fetchWords} 
            />
          )}

          {activeTab === 'list' && (
            <ListTab
              darkMode={darkMode}
              words={words}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              onSort={handleSort}
              showMessage={showMessage}
              setActiveTab={setActiveTab}
              setWords={setWords}
              fetchWords={fetchWords}
            />
          )}

          {activeTab === 'practice' && (
            <PracticeTab
              darkMode={darkMode}
              words={words}
            />
          )}

          {activeTab === 'quiz' && (
            <QuizTab
              darkMode={darkMode}
              words={words}
            />
          )}
        </div>

        {/* Message Toast */}
        {message && (
          <div className={`fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 transition-all ${
            message.type === 'error' 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
          }`}>
            <AlertCircle className="w-5 h-5" />
            {message.text}
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryApp;