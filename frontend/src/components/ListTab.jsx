import React from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';

const ListTab = ({ 
  darkMode, 
  words, 
  handleEdit, 
  handleDelete,
  onSort 
}) => {
  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { field: 'english', label: 'คำศัพท์' },
          { field: 'thai', label: 'คำแปล' },
          { field: 'category', label: 'หมวดหมู่' }
        ].map(({ field, label }) => (
          <button
            key={field}
            onClick={() => onSort(field)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            } transition-colors`}
          >
            <ArrowUpDown className="w-4 h-4" />
            {`เรียงตาม${label}`}
          </button>
        ))}
      </div>

      {/* Words Table */}
      <div className={`rounded-lg overflow-hidden ${
        darkMode ? 'border-gray-700' : 'border border-gray-200'
      }`}>
        <table className="w-full">
          <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className="px-6 py-4 text-center">คำศัพท์</th>
              <th className="px-6 py-4 text-center">คำแปล</th>
              <th className="px-6 py-4 text-center">หมวดหมู่</th>
              <th className="px-6 py-4 text-right"></th>
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
                    className="text-blue-500 hover:text-blue-600 transition-colors inline-flex items-center"
                    title="แก้ไข"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(word.english)}
                    className="text-red-500 hover:text-red-600 transition-colors inline-flex items-center"
                    title="ลบ"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListTab;