import React, { useState, useEffect } from 'react';
import { Search, Plus, Book, Moon, Sun, Trash2, Edit2, X, Check, AlertCircle } from 'lucide-react';

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

  const fetchWords = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/words/');
      const data = await response.json();
      setWords(data);
    } catch (error) {
      showMessage('error', 'ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      if (!searchTerm.trim()) {
        fetchWords();
        return;
      }
      
      const response = await fetch(`http://localhost:8000/api/v1/words/${searchTerm}`);
      if (response.ok) {
        const data = await response.json();
        setWords([data]);
      } else {
        showMessage('error', 'ไม่พบคำศัพท์ที่ค้นหา');
        setWords([]);
      }
    } catch (error) {
      showMessage('error', 'เกิดข้อผิดพลาดในการค้นหา');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (english) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/words/${english}`, {
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
        response = await fetch(`http://localhost:8000/api/v1/words/${editingWord.english}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newWord),
        });
      } else {
        response = await fetch('http://localhost:8000/api/v1/words/', {
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
        showMessage('error', data.detail || 'เกิดข้อผิดพลาด');
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
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Book className="w-8 h-8" />
            <span>พจนานุกรม อังกฤษ-ไทย</span>
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'search', label: 'ค้นหาคำศัพท์', icon: Search },
            { id: 'add', label: editingWord ? 'แก้ไขคำศัพท์' : 'เพิ่มคำศัพท์', icon: Plus },
            { id: 'list', label: 'รายการคำศัพท์', icon: Book }
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
                  : `${darkMode ? 'hover:bg-gray-800' : 'hover:bg-white hover:shadow'}`
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
          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  className={`w-full pl-12 pr-4 py-4 rounded-lg text-lg ${
                    darkMode 
                      ? 'bg-gray-700 focus:bg-gray-600 border-gray-600' 
                      : 'bg-gray-50 focus:bg-white border-gray-200'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  placeholder="พิมพ์คำศัพท์ที่ต้องการค้นหา..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Search Results */}
              {words.length > 0 && (
                <div className="space-y-4">
                  {words.map((word) => (
                    <div
                      key={word.english}
                      className={`p-4 rounded-lg transition-all hover:scale-[1.02] ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-medium mb-2">{word.english}</h3>
                          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {word.thai}
                          </p>
                        </div>
                        {word.category && (
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            darkMode ? 'bg-gray-600' : 'bg-gray-200'
                          }`}>
                            {word.category}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add/Edit Form */}
          {activeTab === 'add' && (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-4">
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="คำศัพท์ภาษาอังกฤษ"
                  value={newWord.english}
                  onChange={(e) => setNewWord({ ...newWord, english: e.target.value })}
                  disabled={editingWord}
                  required
                />
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="คำแปลภาษาไทย"
                  value={newWord.thai}
                  onChange={(e) => setNewWord({ ...newWord, thai: e.target.value })}
                  required
                />
                <input
                  type="text"
                  className={`w-full px-4 py-3 rounded-lg ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="หมวดหมู่ (ไม่บังคับ)"
                  value={newWord.category}
                  onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  {editingWord ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {editingWord ? 'บันทึกการแก้ไข' : 'เพิ่มคำศัพท์'}
                </button>
                {editingWord && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWord(null);
                      setNewWord({ english: '', thai: '', category: '' });
                    }}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    ยกเลิก
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Word List */}
          {activeTab === 'list' && (
            <div className={`rounded-lg overflow-hidden ${
              darkMode ? 'border-gray-700' : 'border border-gray-200'
            }`}>
              <table className="w-full">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                  <tr>
                    <th className="px-6 py-4 text-left">คำศัพท์</th>
                    <th className="px-6 py-4 text-left">คำแปล</th>
                    <th className="px-6 py-4 text-left">หมวดหมู่</th>
                    <th className="px-6 py-4 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {words.map((word) => (
                    <tr 
                      key={word.english} 
                      className={`border-b ${
                        darkMode 
                          ? 'border-gray-700 hover:bg-gray-700' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4">{word.english}</td>
                      <td className="px-6 py-4">{word.thai}</td>
                      <td className="px-6 py-4">{word.category || '-'}</td>
                      <td className="px-6 py-4 text-right space-x-4">
                        <button
                          onClick={() => handleEdit(word)}
                          className="text-blue-500 hover:text-blue-600 transition-colors inline-flex items-center">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(word.english)}
                          className="text-red-500 hover:text-red-600 transition-colors inline-flex items-center"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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