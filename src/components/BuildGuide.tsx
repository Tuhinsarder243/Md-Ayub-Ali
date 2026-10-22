import React from 'react';
import {
  Cpu,
  Layers,
  ShieldCheck,
  Flame,
  CheckCircle,
  AlertCircle,
  Terminal,
  Smartphone,
  ExternalLink
} from 'lucide-react';

export function BuildGuide() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-4 text-slate-200">
      {/* Intro Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Android Studio &amp; Firebase Setup Guide
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Complete walk-through to compile, deploy, and configure Auto AI Lite on physical Android devices.
        </p>
      </div>

      {/* APK Generation Methods Highlight Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-cyan-950/70 border-2 border-cyan-500/50 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-400 text-slate-950 font-black flex items-center justify-center text-lg shadow-lg shadow-cyan-400/20">
            APK
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">
              কিভাবে APK ফাইল তৈরি করবেন? (How to generate the .APK file)
            </h3>
            <p className="text-xs text-slate-300">
              অ্যান্ড্রয়েড অ্যাপ সরাসরি ফোনে ইনস্টল করার জন্য <code className="text-cyan-300 font-mono">.apk</code> ফাইল তৈরি করার ৩টি সহজ উপায় নিচে দেওয়া হলো:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          {/* Method 1 */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold block w-fit">
              পদ্ধতি ১: Android Studio (১ ক্লিকে)
            </span>
            <p className="text-slate-300 leading-relaxed">
              প্রজেক্ট জিপ ডাউনলোড করে Android Studio তে ওপেন করুন। তারপর ওপরের মেনু থেকে:
            </p>
            <code className="block p-2 rounded bg-slate-900 text-cyan-300 font-mono text-[11px] border border-slate-800">
              Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)
            </code>
            <p className="text-slate-400 text-[11px]">
              ক্লিক করলেই <code className="text-emerald-400 font-mono">app-debug.apk</code> তৈরি হয়ে যাবে এবং ফোল্ডার ওপেন করার "locate" অপশন আসবে।
            </p>
          </div>

          {/* Method 2 */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold block w-fit">
              পদ্ধতি ২: GitHub Actions (কম্পিউটার ছাড়া ফ্রি)
            </span>
            <p className="text-slate-300 leading-relaxed">
              প্রজেক্টের ভেতর আমরা অটোমেটেড <code className="text-cyan-300 font-mono">build-apk.yml</code> দিয়ে দিয়েছি।
            </p>
            <p className="text-slate-400 text-[11px]">
              ফাইলগুলো আপনার GitHub রিপোজিটরিতে আপলোড করলেই GitHub নিজে থেকেই ক্লাউডে APK বানিয়ে Artifacts ট্যাবে ডাউনলোডের জন্য রেডি করে দেবে!
            </p>
          </div>

          {/* Method 3 */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold block w-fit">
              পদ্ধতি ৩: টার্মিনাল / কমান্ড লাইন
            </span>
            <p className="text-slate-300 leading-relaxed">
              প্রজেক্ট ফোল্ডারে টার্মিনাল খুলে কমান্ড দিন:
            </p>
            <code className="block p-2 rounded bg-slate-900 text-amber-300 font-mono text-[11px] border border-slate-800">
              ./gradlew assembleDebug
            </code>
            <p className="text-slate-400 text-[11px]">
              APK ফাইলটি পাবেন: <code className="text-slate-300 font-mono">app/build/outputs/apk/debug/app-debug.apk</code>
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Android Studio Project Import */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center border border-cyan-500/30">
            1
          </div>
          <h3 className="text-lg font-bold text-white">
            Import into Android Studio &amp; Gradle Sync
          </h3>
        </div>

        <div className="text-sm text-slate-300 space-y-2 leading-relaxed">
          <p>
            1. Download the full project ZIP using the <strong>"Download Project (.zip)"</strong> button in the Code Explorer tab.
          </p>
          <p>
            2. Extract the archive into your preferred Android projects directory (e.g., <code className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 font-mono text-xs">~/AndroidStudioProjects/AutoAILite</code>).
          </p>
          <p>
            3. Open <strong>Android Studio</strong> (Iguana, Jellyfish, Koala or newer) and select <strong>File &gt; Open...</strong>, choosing the extracted root folder.
          </p>
          <p>
            4. Wait for Gradle to download dependencies and sync. The project targets <strong>minSdk 26</strong> (Android 8.0) and <strong>compileSdk 34</strong> (Android 14) with Java 17.
          </p>
        </div>
      </div>

      {/* Step 2: Android 13/14 Permissions & System Overlay */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center border border-cyan-500/30">
            2
          </div>
          <h3 className="text-lg font-bold text-white">
            Granting Overlay &amp; Accessibility Permissions
          </h3>
        </div>

        <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex gap-3">
            <Smartphone className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">A. Display Over Other Apps (Overlay Permission)</strong>
              <p className="text-xs text-slate-400">
                Go to <em>Settings &gt; Apps &gt; Special App Access &gt; Display over other apps</em>, locate <strong>Auto AI Lite</strong>, and toggle <strong>Allow</strong>. The app dashboard will indicate "Granted" in green.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">B. Accessibility Service Enablement</strong>
              <p className="text-xs text-slate-400">
                Go to <em>Settings &gt; Accessibility &gt; Downloaded Apps</em> (or Installed Services), tap <strong>Auto AI Lite</strong>, and toggle the switch to <strong>ON</strong>. Accept the prompt allowing tap gesture dispatch.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">C. Android 14 Restricted Settings Override</strong>
              <p className="text-xs text-slate-400">
                If Android 14 grays out Accessibility with "Restricted setting": Open <em>App Info for Auto AI Lite &gt; 3 dots in top right &gt; Allow restricted settings</em>, authenticate, then re-open Accessibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Firebase Auth & Firestore Setup */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center border border-amber-500/30">
            3
          </div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>Firebase Authentication &amp; Firestore Setup</span>
          </h3>
        </div>

        <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>
            1. Head to the <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-amber-400 underline inline-flex items-center gap-1">Firebase Console <ExternalLink className="w-3 h-3" /></a> and create or select your project.
          </p>
          <p>
            2. Click <strong>Add App &gt; Android</strong>. Enter package name: <code className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 font-mono text-xs">com.example.autoailite</code>.
          </p>
          <p>
            3. Download <code className="px-1.5 py-0.5 rounded bg-slate-950 text-amber-300 font-mono text-xs">google-services.json</code> and place it inside your project's <code className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 font-mono text-xs">app/</code> directory:
          </p>
          <pre className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-slate-400 border border-slate-800 overflow-x-auto">
{`AutoAILite/
  └── app/
      ├── google-services.json  <-- Place downloaded file here
      ├── build.gradle.kts
      └── src/...`}
          </pre>
          <p>
            4. In the Firebase Console, navigate to <strong>Build &gt; Authentication</strong> and enable <strong>Anonymous</strong> sign-in (or Email/Password).
          </p>
          <p>
            5. Navigate to <strong>Build &gt; Firestore Database</strong>, create a database in production mode, and set the following security rules in <strong>Rules</strong>:
          </p>
          <pre className="p-3.5 bg-slate-950 rounded-xl text-xs font-mono text-cyan-300 border border-slate-800 overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /licenses/{uid} {
      // Allow read/write for own authenticated device UID
      allow read, write: if request.auth != null;
    }
  }
}`}
          </pre>
        </div>
      </div>

      {/* Step 4: Gemini API Key Setup */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center border border-cyan-500/30">
            4
          </div>
          <h3 className="text-lg font-bold text-white">
            Configuring Gemini AI Decision Engine
          </h3>
        </div>

        <div className="text-sm text-slate-300 space-y-2 leading-relaxed">
          <p>
            In the app's <strong>Settings</strong> screen, paste your Gemini API Key. It is automatically stored inside Android's hardware-backed <code className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300 font-mono text-xs">EncryptedSharedPreferences</code> using AES-256 GCM encryption.
          </p>
          <p>
            The app utilizes <strong>Gemini 2.5 Flash</strong> via fast JSON mode for real-time latency responses (&lt;800ms) with high-confidence trade/action determinations.
          </p>
        </div>
      </div>
    </div>
  );
}
