import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const ListTab = ({ 
  darkMode, 
  words, 
  handleEdit, 
  handleDelete 
}) => {
  return (
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
  );
};

export default ListTab;