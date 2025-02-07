import React, { useState } from 'react';
import { Plus, Check, X, Upload } from 'lucide-react';
import ImportWords from './ImportWords';

const AddEditTab = ({
  darkMode,
  handleSubmit,
  newWord,
  setNewWord,
  editingWord,
  setEditingWord,
  showMessage,
  fetchWords
}) => {
  const [showImport, setShowImport] = useState(false);

  const handleImportSuccess = (message) => {
    showMessage('success', message);
    fetchWords();
    setShowImport(false);
  };

  return (
    <div className="space-y-8">
      {/* Toggle Buttons */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setShowImport(false)}
          className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
            !showImport
              ? 'bg-blue-500 text-white'
              : darkMode
              ? 'bg-gray-700 text-gray-300'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Plus className="w-5 h-5 inline-block mr-2" />
          เพิ่มทีละคำ
        </button>
        <button
          type="button"
          onClick={() => setShowImport(true)}
          className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
            showImport
              ? 'bg-blue-500 text-white'
              : darkMode
              ? 'bg-gray-700 text-gray-300'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Upload className="w-5 h-5 inline-block mr-2" />
          นำเข้าจากไฟล์
        </button>
      </div>

      {showImport ? (
        <ImportWords 
          darkMode={darkMode}
          onImportSuccess={handleImportSuccess}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          <div className="space-y-4">
            <input
              type="text"
              className={`w-full px-4 py-3 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-900'
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
                  : 'bg-gray-50 border-gray-200 text-gray-900'
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
                  : 'bg-gray-50 border-gray-200 text-gray-900'
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
    </div>
  );
};

export default AddEditTab;