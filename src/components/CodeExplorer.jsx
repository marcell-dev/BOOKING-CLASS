import React, { useState } from 'react';
import { javaFiles } from '../javaCodeData';
import { FolderCode, FileCode, Copy, Check, FileText, Blocks, HelpCircle } from 'lucide-react';

export default function CodeExplorer() {
  const [selectedFile, setSelectedFile] = useState(javaFiles[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs bg-[#FFCC00]/20 text-[#002244] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          JAVA SPRING BOOT MVC + PBO REQUIREMENTS
        </span>
        <h2 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
          Arsitektur Kode & Implementasi PBO Java Backend
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Didesain matang dengan kaidah OOP (Model-View-Controller) Java v17, Collection Framework, Polimorfisme Interface, dan Exception Handling.
        </p>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left column: Sidebar files list */}
        <div className="xl:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
            <Blocks className="w-4 h-4 text-slate-400" />
            Struktur Paket & Berkas
          </h3>

          <div className="space-y-1">
            {/* Packages Visual Indicator */}
            <div className="text-[11px] font-mono text-slate-400 px-2 py-1 mb-2 bg-slate-50 rounded border border-slate-100 flex justify-between">
              <span>📦 id.ac.unesa.booking</span>
              <span className="text-emerald-500 font-bold">In-Memory Collections</span>
            </div>

            {javaFiles.map((file) => {
              const isSelected = selectedFile.name === file.name;
              return (
                <button
                  key={file.name}
                  id={`btn-code-file-${file.name.replace(/\s+/g, '')}`}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all group ${
                    isSelected
                      ? 'bg-slate-950 text-white shadow-xl'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div
                    className={`mt-0.5 rounded p-1 shrink-0 ${
                      isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white'
                    }`}
                  >
                    {file.name.endsWith('.html') ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <FileCode className="w-4 h-4" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold font-mono block truncate">{file.name}</span>
                    <span
                      className={`text-[10px] block truncate transition-colors ${
                        isSelected ? 'text-gray-400' : 'text-slate-400 group-hover:text-slate-500'
                      }`}
                    >
                      {file.path.replace('src/main/java/id/ac/unesa/booking/', '.../')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-4.5 bg-indigo-50/70 rounded-xl border border-indigo-100/30 text-xs">
            <h4 className="font-bold text-indigo-950 mb-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              Mengapa Desain Ini?
            </h4>
            <p className="text-indigo-900 leading-relaxed">
              Berkas di atas mengimplementasikan <strong>super()</strong> constructor, dynamic pricing melalui <strong>Enum.getPricePerSession()</strong>, in-memory <strong>ArrayList</strong> collection di <strong>BookingService</strong>, dan interceptor try-catch exception handling.
            </p>
          </div>
        </div>

        {/* Right column: Code Viewer */}
        <div className="xl:col-span-8 bg-[#0F141C] text-gray-300 rounded-xl shadow-xl overflow-hidden border border-slate-800">
          {/* Code Viewer Title bar */}
          <div className="bg-[#05080E] px-6 py-3.5 flex justify-between items-center border-b border-slate-900">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <span className="w-3 h-3 rounded-full bg-red-500 shrink-0"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400 shrink-0"></span>
              <span className="w-3 h-3 rounded-full bg-green-400 shrink-0"></span>
              <span className="text-[11px] font-mono text-slate-400 ml-2 truncate">
                {selectedFile.path}
              </span>
            </div>
            
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-[11px] text-white font-semibold rounded-lg transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copy Source Code</span>
                </>
              )}
            </button>
          </div>

          {/* Description bar */}
          <div className="bg-[#151D29] px-6 py-3 flex items-start gap-2.5 text-xs text-sky-200 border-b border-indigo-950/20">
            <span className="font-bold shrink-0 bg-sky-500/20 px-1.5 py-0.5 rounded text-[10px] uppercase text-sky-300 tracking-wider">
              Keterangan
            </span>
            <span className="leading-relaxed font-medium text-slate-300">
              {selectedFile.description}
            </span>
          </div>

          {/* Code Container */}
          <div className="overflow-x-auto p-6 text-xs leading-relaxed max-h-[580px] overflow-y-auto font-mono scrollbar-thin">
            <pre className="text-left text-neutral-200 select-all font-mono whitespace-pre tab-4">
              <code>{selectedFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
