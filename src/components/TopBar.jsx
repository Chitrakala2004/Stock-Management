import { Search, Bell, User, Menu } from 'lucide-react';

const TopBar = ({ title, onOpenSidebar }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-3.5 sm:px-6 shrink-0 shadow-xs z-10">
      {/* Left Area: Mobile Hamburger + Active Page Title */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu size={22} />
        </button>
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
          {title || 'Dashboard'}
        </h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Search - Hidden on small mobile to give space */}
        <div className="hidden sm:block relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Global search..."
            className="w-36 md:w-52 pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200"></div>

        {/* User Badge */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-xs">
            <User size={16} />
          </div>
          <span className="hidden md:inline text-xs font-semibold text-slate-700">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
