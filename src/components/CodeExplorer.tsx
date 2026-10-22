import React, { useState } from 'react';
import { ALL_ANDROID_FILES, AndroidFile } from '../androidCode';
import {
  FileCode,
  Search,
  Copy,
  Check,
  Download,
  FolderTree,
  Filter,
  FileText
} from 'lucide-react';
import { downloadAndroidProjectZip } from '../utils/zipGenerator';

export function CodeExplorer() {
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(ALL_ANDROID_FILES[6]); // MainActivity.kt by default
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'kotlin' | 'xml' | 'gradle' | 'manifest'>('all');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const filteredFiles = ALL_ANDROID_FILES.filter(file => {
    const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter;
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingleFile = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadAndroidProjectZip('AutoAILite-Android-Project');
    } catch (err) {
      console.error(err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6">
      {/* File Navigation Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        {/* Project Download Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Android Studio Project
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {ALL_ANDROID_FILES.length} Files
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-3">
            Download the complete, ready-to-build Gradle KTS repository for Android Studio.
          </p>
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'Packaging ZIP...' : 'Download Project (.zip)'}</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search files or code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {(['all', 'kotlin', 'xml', 'gradle', 'manifest'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* File Tree List */}
          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
            {filteredFiles.map(file => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-slate-800/90 text-cyan-300 border border-cyan-500/30 shadow'
                      : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${
                    file.language === 'kotlin' ? 'text-indigo-400' :
                    file.language === 'xml' ? 'text-amber-400' : 'text-cyan-400'
                  }`} />
                  <div className="truncate">
                    <span className="font-medium truncate block">{file.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono block truncate">
                      {file.path}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="flex-1 bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col min-w-0">
        {/* File Header Bar */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-100 truncate">
                {selectedFile.name}
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                {selectedFile.language}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {selectedFile.path} · {selectedFile.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Copy file contents"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadSingleFile}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="Download this file"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code View with Line Numbers */}
        <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-300 bg-[#070B14]">
          <pre className="overflow-x-auto">
            <code>
              {selectedFile.content.split('\n').map((line, idx) => (
                <div key={idx} className="table-row hover:bg-slate-900/60 transition-colors">
                  <span className="table-cell pr-4 text-right select-none text-slate-600 text-[11px] font-mono">
                    {idx + 1}
                  </span>
                  <span className="table-cell whitespace-pre">{line}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
