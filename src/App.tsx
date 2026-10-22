import React, { useState } from 'react';
import { AndroidSimulator } from './components/AndroidSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { BuildGuide } from './components/BuildGuide';
import { downloadAndroidProjectZip } from './utils/zipGenerator';
import {
  Smartphone,
  Code2,
  BookOpen,
  Download,
  Terminal,
  ShieldCheck,
  Zap,
  Flame,
  Radio
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'emulator' | 'code' | 'guide'>('emulator');
  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadAndroidProjectZip('AutoAILite-Android-Project');
    } catch (e) {
      console.error(e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-950/40">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white whitespace-nowrap">
                Auto AI Lite
              </span>
              <span className="text-slate-500 text-xs hidden sm:inline-block ml-2 font-mono">
                Android Native Kotlin Suite
              </span>
            </div>
          </div>

          {/* Navigation Links / Tabs */}
          <nav className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('emulator')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'emulator'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Interactive Device</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'code'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>All Project Files</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Setup Guide</span>
            </button>
          </nav>

          {/* Primary Action Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 rounded-xl transition-all shadow-md shadow-cyan-950/30 flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Zipping Project...' : 'Download Project (.zip)'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Download Banner for easy access */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-indigo-950/60 border border-cyan-800/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              <Download className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>সম্পূর্ণ অ্যান্ড্রয়েড প্রজেক্ট ডাউনলোড (Ready to Run)</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                  Android Studio Ready
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                নিচের বাটনটি চাপলেই সব Kotlin, XML লেআউট, ম্যানিফেস্ট ও Gradle ফাইল জিপ (.zip) ফাইলে সরাসরি ডাউনলোড হয়ে যাবে।
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-black text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-xl transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'জিপ তৈরি হচ্ছে...' : 'ডাউনলোড করুন (.ZIP)'}</span>
          </button>
        </div>

        {/* Banner Quick Highlights */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Min SDK 26 · Target SDK 34</span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Foreground Service (specialUse)</span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Accessibility Gesture Dispatch</span>
            </div>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Firebase Auth &amp; Firestore Licensing</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Package: com.example.autoailite
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'emulator' && <AndroidSimulator />}
        {activeTab === 'code' && <CodeExplorer />}
        {activeTab === 'guide' && <BuildGuide />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 px-6 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Auto AI Lite · Native Android Architecture</span>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Coroutines + StateFlow</span>
            <span>ViewBinding</span>
            <span>EncryptedSharedPreferences</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
