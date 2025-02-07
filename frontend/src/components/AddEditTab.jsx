import React from 'react';
import { Plus, Check, X } from 'lucide-react';

const AddEditTab = ({
  darkMode,
  handleSubmit,
  newWord,
  setNewWord,
  editingWord,
  setEditingWord
}) => {
  return (
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
  );
};

export default AddEditTab;