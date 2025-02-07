import React, { useState } from 'react';
import { Upload, AlertCircle, FileText, Check } from 'lucide-react';
import Papa from 'papaparse';

const ImportWords = ({ darkMode, onImportSuccess }) => {
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // รีเซ็ตสถานะ
    setPreviewData(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // พยายามแปลงเป็น CSV ก่อน
        Papa.parse(e.target.result, {
          complete: (results) => {
            if (results.errors.length > 0) {
              setError('ไฟล์ไม่ถูกต้อง กรุณาตรวจสอบรูปแบบ');
              return;
            }

            // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
            const words = results.data
              .filter(row => row.length >= 2) // กรองแถวที่มีข้อมูลไม่ครบ
              .map(row => ({
                english: row[0]?.trim(),
                thai: row[1]?.trim(),
                category: row[2]?.trim() || null
              }))
              .filter(word => word.english && word.thai); // กรองข้อมูลที่ไม่สมบูรณ์

            if (words.length === 0) {
              setError('ไม่พบข้อมูลที่ถูกต้องในไฟล์');
              return;
            }

            setPreviewData(words);
          },
          error: (error) => {
            setError('เกิดข้อผิดพลาดในการอ่านไฟล์');
          }
        });
      } catch (error) {
        setError('เกิดข้อผิดพลาดในการประมวลผลไฟล์');
      }
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!previewData) return;

    try {
      // ส่งข้อมูลไปยัง API
      const response = await fetch('http://localhost:8000/api/v1/words/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ words: previewData }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'เกิดข้อผิดพลาดในการนำเข้าข้อมูล');
      }

      const result = await response.json();
      onImportSuccess(result.message);
      setPreviewData(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* คำแนะนำการใช้งาน */}
      <div className={`p-4 rounded-lg ${
        darkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <h3 className={`font-medium mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>รูปแบบไฟล์ที่รองรับ:</h3>
        <div className="space-y-2">
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            1. ไฟล์ CSV หรือ TXT ที่มีข้อมูลในรูปแบบ:
          </p>
          <pre className={`p-2 rounded ${
            darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'
          }`}>
            english,thai[,category]
            cat,แมว,animal
            dog,สุนัข,animal
          </pre>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            หมายเหตุ: หมวดหมู่เป็นทางเลือก สามารถเว้นว่างได้
          </p>
        </div>
      </div>

      {/* อัพโหลดไฟล์ */}
      <div className="flex justify-center">
        <label className={`cursor-pointer flex items-center gap-2 px-6 py-3 rounded-lg ${
          darkMode 
            ? 'bg-gray-700 hover:bg-gray-600' 
            : 'bg-white hover:bg-gray-50 border border-gray-200'
        }`}>
          <Upload className={`w-5 h-5 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`} />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            เลือกไฟล์
          </span>
          <input
            type="file"
            className="hidden"
            accept=".csv,.txt"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      {/* แสดงข้อผิดพลาด */}
      {error && (
        <div className="p-4 bg-red-500 text-white rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* แสดงตัวอย่างข้อมูล */}
      {previewData && (
        <div className="space-y-4">
          <h3 className={`font-medium ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            ตัวอย่างข้อมูล ({previewData.length} คำ):
          </h3>
          
          <div className={`rounded-lg overflow-hidden border ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <table className="w-full">
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th className={`px-4 py-2 text-left ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>คำศัพท์</th>
                  <th className={`px-4 py-2 text-left ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>คำแปล</th>
                  <th className={`px-4 py-2 text-left ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>หมวดหมู่</th>
                </tr>
              </thead>
              <tbody>
                {previewData.slice(0, 5).map((word, index) => (
                  <tr key={index} className={`border-t ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <td className={`px-4 py-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{word.english}</td>
                    <td className={`px-4 py-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{word.thai}</td>
                    <td className={`px-4 py-2 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{word.category || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {previewData.length > 5 && (
              <div className={`px-4 py-2 text-center ${
                darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-50 text-gray-500'
              }`}>
                และอีก {previewData.length - 5} คำ
              </div>
            )}
          </div>

          <button
            onClick={handleImport}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            นำเข้าข้อมูล
          </button>
        </div>
      )}
    </div>
  );
};

export default ImportWords;