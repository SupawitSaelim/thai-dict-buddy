import React, { useState } from 'react';
import { Edit2, Trash2, ArrowUpDown, AlertTriangle } from 'lucide-react';

const ListTab = ({ 
  darkMode, 
  words, 
  handleEdit, 
  handleDelete,
  onSort,
  showMessage,
  setActiveTab,
  setWords,
  fetchWords  // เพิ่ม prop สำหรับโหลดข้อมูลใหม่
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleDeleteAll = () => {
    fetch('http://localhost:8000/api/v1/words/', {
      method: 'DELETE'
    }).then(() => {
      showMessage('success', 'ลบคำศัพท์ทั้งหมดเรียบร้อยแล้ว');
      setWords([]); // เคลียร์ข้อมูลในสเตท
      fetchWords(); // โหลดข้อมูลใหม่
      setActiveTab('search'); // เปลี่ยนแท็บ
      setShowConfirmDialog(false);
    }).catch(() => {
      showMessage('error', 'เกิดข้อผิดพลาดในการลบข้อมูล');
      setShowConfirmDialog(false);
    });
  };

  return (
    <div className="space-y-4">
      {/* Sort Controls and Delete All Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap gap-2">
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
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              } transition-colors`}
            >
              <ArrowUpDown className="w-4 h-4" />
              {`เรียงตาม${label}`}
            </button>
          ))}
        </div>
        {words.length > 0 && (
          <button
            onClick={() => setShowConfirmDialog(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            ลบทั้งหมด
          </button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} max-w-md w-full mx-4`}>
            <div className="flex items-center gap-3 text-yellow-500 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-xl font-medium">ยืนยันการลบ</h3>
            </div>
            <p className={`mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>คุณแน่ใจหรือไม่ที่จะลบคำศัพท์ทั้งหมด {words.length} คำ? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className={`px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Words Table */}
      <div className={`rounded-lg overflow-hidden ${
        darkMode ? 'border-gray-700' : 'border border-gray-200'
      }`}>
        <table className="w-full">
          <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-4 text-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>คำศัพท์</th>
              <th className={`px-6 py-4 text-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>คำแปล</th>
              <th className={`px-6 py-4 text-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>หมวดหมู่</th>
              <th className={`px-6 py-4 text-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}></th>
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
                <td className={`px-6 py-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>{word.english}</td>
                <td className={`px-6 py-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>{word.thai}</td>
                <td className={`px-6 py-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>{word.category || '-'}</td>
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