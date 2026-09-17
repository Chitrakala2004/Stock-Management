import { Search, Bell } from 'lucide-react';

const TopBar = ({ title }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      {/* Page Title */}
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Global search..."
            className="w-52 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell size={19} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200"></div>

        {/* User */}
        <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">A</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
