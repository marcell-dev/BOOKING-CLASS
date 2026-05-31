import React from 'react';
import { LayoutDashboard, Code, Shield, User, GraduationCap, School } from 'lucide-react';

export default function Sidebar({ currentTab, setCurrentTab, userRole, setUserRole }) {
  return (
    <aside className="w-64 bg-[#003366] text-white flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none shadow-xl border-r border-blue-900/40">
      <div className="flex flex-col flex-1">
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-blue-900/50">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm">
            <div className="w-6 h-6 border-4 border-[#003366] rounded-full"></div>
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-none tracking-tight">A10-BOOKING</h1>
            <span className="text-[10px] text-blue-200 uppercase tracking-widest block mt-1 font-semibold">UNESA PROPERTY</span>
          </div>
        </div>

        {/* User Role Indicator & Switcher (Styled as utility panel) */}
        <div className="mx-4 my-5 p-4 bg-blue-950/50 rounded-2xl border border-blue-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-blue-200/80 font-bold uppercase tracking-wider">
              Akses Pengguna
            </span>
            <span className="font-mono text-[9px] text-[#00E5FF] font-black flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full"></span>
              ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-white bg-blue-950/60 p-2.5 rounded-xl border border-blue-900/50 mb-3">
            {userRole === 'CUSTOMER' ? (
              <>
                <GraduationCap className="w-4 h-4 text-blue-300" />
                <span className="font-medium">Customer (Civitas)</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="font-medium text-amber-100">Administrator</span>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              id="switch-to-customer"
              onClick={() => {
                setUserRole('CUSTOMER');
                setCurrentTab('dashboard');
              }}
              className={`flex-1 py-1.5 text-[10px] rounded-lg font-bold transition-all border cursor-pointer ${
                userRole === 'CUSTOMER'
                  ? 'bg-white text-[#003366] border-white shadow-sm'
                  : 'bg-transparent text-blue-200 border-blue-800 hover:bg-blue-800/20'
              }`}
            >
              Customer
            </button>
            <button
              id="switch-to-admin"
              onClick={() => {
                setUserRole('ADMIN');
                setCurrentTab('admin-panel');
              }}
              className={`flex-1 py-1.5 text-[10px] rounded-lg font-bold transition-all border cursor-pointer ${
                userRole === 'ADMIN'
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-transparent text-blue-200 border-blue-800 hover:bg-blue-800/20'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 space-y-2">
          <button
            id="nav-tab-dashboard"
            onClick={() => setCurrentTab('dashboard')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              currentTab === 'dashboard'
                ? 'bg-blue-800/40 text-white'
                : 'text-blue-100/60 hover:bg-blue-800/20'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 opacity-80" />
            <span>Reservasi Ruangan</span>
          </button>

          {userRole === 'ADMIN' && (
            <button
              id="nav-tab-admin"
              onClick={() => setCurrentTab('admin-panel')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                currentTab === 'admin-panel'
                  ? 'bg-blue-800/40 text-white'
                  : 'text-blue-100/60 hover:bg-blue-800/20'
              }`}
            >
              <Shield className="w-4 h-4 opacity-80" />
              <span>Kelola (Admin Panel)</span>
            </button>
          )}

          <button
            id="nav-tab-code"
            onClick={() => setCurrentTab('code-explorer')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              currentTab === 'code-explorer'
                ? 'bg-blue-800/40 text-white'
                : 'text-blue-100/60 hover:bg-blue-800/20'
            }`}
          >
            <Code className="w-4 h-4 opacity-80" />
            <span>Source Code Explorer</span>
          </button>
        </nav>
      </div>

      {/* Footer styled with deep contrast like the mock-up */}
      <div className="p-6 bg-blue-950 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-blue-950 font-bold text-xs shrink-0 shadow-inner">
          {userRole === 'CUSTOMER' ? 'CS' : 'AD'}
        </div>
        <div className="overflow-hidden text-left">
          <p className="text-xs font-semibold truncate text-white">
            {userRole === 'CUSTOMER' ? 'Civitas Academica' : 'Heaven Arvian M.D'}
          </p>
          <p className="text-[10px] text-blue-300 uppercase font-bold tracking-wider mt-0.5">
            Role: {userRole}
          </p>
        </div>
      </div>
    </aside>
  );
}
