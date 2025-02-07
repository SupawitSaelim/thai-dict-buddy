import React from 'react';
import { Search } from 'lucide-react';

const SearchTab = ({ 
  darkMode, 
  searchTerm, 
  setSearchTerm, 
  handleSearch, 
  words 
}) => {
  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          className={`w-full pl-12 pr-4 py-4 rounded-lg text-lg ${
            darkMode 
              ? 'bg-gray-700 focus:bg-gray-600 border-gray-600' 
              : 'bg-gray-50 focus:bg-white border-gray-200 text-gray-900'
          } border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          placeholder="พิมพ์คำศัพท์ที่ต้องการค้นหา..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>

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
                    <h3 className={`text-xl font-medium mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{word.english}</h3>
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
  );
};

export default SearchTab;