import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Square,
  Settings,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Sliders,
  Users,
  Eye,
  Minimize2,
  Maximize2,
  X,
  Target,
  Sparkles,
  Zap,
  Globe,
  Radio,
  Lock
} from 'lucide-react';

interface AppConfig {
  buttonAX: number;
  buttonAY: number;
  buttonBX: number;
  buttonBY: number;
  amount: number;
  delayMs: number;
  maxActions: number;
  stopAfterLosses: number;
  language: 'en' | 'bn';
  engineType: 'gemini' | 'placeholder';
  apiKey: string;
}

interface AdminUser {
  uid: string;
  deviceModel: string;
  appVersion: string;
  status: 'Active' | 'Blocked' | 'Expired';
  expiryDate: string;
  totalActions: number;
}

export function AndroidSimulator() {
  // App State
  const [hasOverlayPermission, setHasOverlayPermission] = useState(true);
  const [hasAccessibilityPermission, setHasAccessibilityPermission] = useState(true);
  const [isFloatingServiceRunning, setIsFloatingServiceRunning] = useState(false);
  const [isOverlayExpanded, setIsOverlayExpanded] = useState(true);

  // Auto Automation Engine State
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentSignal, setCurrentSignal] = useState<'UP' | 'DOWN' | 'WAIT' | 'STANDBY' | 'ANALYSING'>('STANDBY');
  const [signalReason, setSignalReason] = useState<string>('Standby - Engine ready');
  const [signalConfidence, setSignalConfidence] = useState<number>(0.88);
  const [actionCount, setActionCount] = useState(0);
  const [activeTapPoint, setActiveTapPoint] = useState<{ x: number; y: number; label: string } | null>(null);

  // Position Picker State
  const [pickingTarget, setPickingTarget] = useState<'A' | 'B' | null>(null);

  // Floating window position (draggable)
  const [floatPos, setFloatPos] = useState({ x: 30, y: 140 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });

  // Dialogs & Modals
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [adminPressTimer, setAdminPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [adminUnlockedHint, setAdminUnlockedHint] = useState(false);

  // Configuration (DataStore representation)
  const [config, setConfig] = useState<AppConfig>({
    buttonAX: 180,
    buttonAY: 520,
    buttonBX: 180,
    buttonBY: 580,
    amount: 10.0,
    delayMs: 2500,
    maxActions: 30,
    stopAfterLosses: 3,
    language: 'en',
    engineType: 'gemini',
    apiKey: ''
  });

  // Admin users (Firestore licenses)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    { uid: 'usr_pixel_872', deviceModel: 'Google Pixel 8 Pro', appVersion: '1.0.0', status: 'Active', expiryDate: '2026-12-31', totalActions: 148 },
    { uid: 'usr_s24_551', deviceModel: 'Samsung Galaxy S24 Ultra', appVersion: '1.0.0', status: 'Active', expiryDate: '2026-11-20', totalActions: 92 },
    { uid: 'usr_mi14_903', deviceModel: 'Xiaomi 14 Pro', appVersion: '1.0.0', status: 'Blocked', expiryDate: '2026-09-14', totalActions: 310 },
    { uid: 'usr_op12_412', deviceModel: 'OnePlus 12', appVersion: '1.0.0', status: 'Expired', expiryDate: '2026-04-10', totalActions: 24 }
  ]);

  // Translations
  const isBn = config.language === 'bn';
  const t = {
    appName: isBn ? 'অটো এআই লাইট' : 'Auto AI Lite',
    startFloating: isBn ? 'ভাসমান প্যানেল শুরু করুন' : 'Start Floating Panel',
    stopFloating: isBn ? 'ভাসমান প্যানেল বন্ধ করুন' : 'Stop Floating Panel',
    serviceActive: isBn ? 'সার্ভিস সক্রিয়' : 'Service Active',
    serviceIdle: isBn ? 'সার্ভিস নিষ্ক্রিয়' : 'Service Idle',
    granted: isBn ? 'অনুমোদিত' : 'Granted',
    denied: isBn ? 'অনুমতি নেই' : 'Denied (Required)',
    enabled: isBn ? 'চালু আছে' : 'Enabled',
    disabled: isBn ? 'বন্ধ আছে' : 'Disabled (Required)',
    startAuto: isBn ? 'START AUTO' : 'START AUTO',
    stopAuto: isBn ? 'STOP AUTO' : 'STOP AUTO',
    actionsProgress: (count: number, max: number) => isBn ? `${count} / ${max} টি অ্যাকশন সম্পন্ন` : `${count} / ${max} actions`,
    riskTitle: isBn ? 'সতর্কতা ও ঝুঁকি ঘোষণা' : 'Safety & Risk Disclaimer',
    riskBody: isBn
      ? 'অটো এআই লাইট স্বয়ংক্রিয়ভাবে স্ক্রিনে স্পর্শ করে। কোনো প্ল্যাটফর্মে অটোমেশন ব্যবহারে নিজ বিবেচনায় ও সতর্কতার সাথে নিরাপদ সীমা বজায় রাখুন।'
      : 'Auto AI Lite executes automated gestures and tap actions. Automated usage carries inherent risk depending on external platforms. Always test with minimal amounts and safe limits.',
    accept: isBn ? 'আমি অবগত ও সম্মত' : 'I Accept & Understand',
    settingsTitle: isBn ? 'অটোমেশন কনফিগারেশন' : 'Automation Settings'
  };

  // Automated Execution Loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let cancelled = false;

    if (isAutoRunning && isFloatingServiceRunning) {
      if (actionCount >= config.maxActions) {
        setIsAutoRunning(false);
        setCurrentSignal('STANDBY');
        setSignalReason(`Hard safety limit reached (${config.maxActions} actions)`);
        return;
      }

      // Step 1: 3-second countdown
      setCountdown(3);
      setCurrentSignal('STANDBY');

      const runCycle = async () => {
        for (let c = 3; c >= 1; c--) {
          if (cancelled) return;
          setCountdown(c);
          await new Promise(r => setTimeout(r, 900));
        }

        if (cancelled) return;
        setCountdown(null);
        setCurrentSignal('ANALYSING');
        setSignalReason('Scanning market momentum & screen vectors...');

        // Sweeping scan time
        await new Promise(r => setTimeout(r, 1400));
        if (cancelled) return;

        // Determine Signal
        const nextSig: 'UP' | 'DOWN' | 'WAIT' = Math.random() < 0.48 ? 'UP' : Math.random() < 0.85 ? 'DOWN' : 'WAIT';
        setCurrentSignal(nextSig);

        if (nextSig === 'UP') {
          setSignalReason('Momentum breakout above moving average: Bullish (UP)');
          setSignalConfidence(0.89);
          // Trigger dispatchGesture tap at Button A coordinates
          setActiveTapPoint({ x: config.buttonAX, y: config.buttonAY, label: 'Button A (UP)' });
          setActionCount(prev => prev + 1);
        } else if (nextSig === 'DOWN') {
          setSignalReason('Resistance rejection at upper envelope: Bearish (DOWN)');
          setSignalConfidence(0.92);
          // Trigger dispatchGesture tap at Button B coordinates
          setActiveTapPoint({ x: config.buttonBX, y: config.buttonBY, label: 'Button B (DOWN)' });
          setActionCount(prev => prev + 1);
        } else {
          setSignalReason('High volatility consolidation detected. Holding position (WAIT)');
          setSignalConfidence(0.74);
        }

        // Tap ripple duration
        setTimeout(() => {
          if (!cancelled) setActiveTapPoint(null);
        }, 800);

        // Delay between actions
        await new Promise(r => setTimeout(r, config.delayMs));
        if (!cancelled && isAutoRunning) {
          runCycle();
        }
      };

      runCycle();
    } else {
      setCountdown(null);
      if (currentSignal === 'ANALYSING') {
        setCurrentSignal('STANDBY');
      }
    }

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [isAutoRunning, isFloatingServiceRunning, actionCount, config.maxActions, config.delayMs, config.buttonAX, config.buttonAY, config.buttonBX, config.buttonBY]);

  // Dragging handlers for Floating Service Overlay
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      startX: floatPos.x,
      startY: floatPos.y
    };
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragStartRef.current.mouseX;
    const dy = clientY - dragStartRef.current.mouseY;

    setFloatPos({
      x: Math.max(10, Math.min(200, dragStartRef.current.startX + dx)),
      y: Math.max(80, Math.min(560, dragStartRef.current.startY + dy))
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Screen click for Position Picker
  const handlePhoneScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pickingTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (pickingTarget === 'A') {
      setConfig(prev => ({ ...prev, buttonAX: x, buttonAY: y }));
    } else {
      setConfig(prev => ({ ...prev, buttonBX: x, buttonBY: y }));
    }
    setPickingTarget(null);
  };

  // App Title Long-Press for Secret Admin Panel
  const handleTitleMouseDown = () => {
    const tId = setTimeout(() => {
      setShowAdminModal(true);
      setAdminUnlockedHint(true);
    }, 1200);
    setAdminPressTimer(tId);
  };

  const handleTitleMouseUp = () => {
    if (adminPressTimer) {
      clearTimeout(adminPressTimer);
      setAdminPressTimer(null);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 py-6 w-full">
      {/* Phone Mockup Frame */}
      <div className="relative">
        {/* Android Device Shell */}
        <div
          className="relative w-[360px] h-[740px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50 select-none overflow-hidden"
          onMouseMove={handleDragMove}
          onTouchMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
        >
          {/* Top Speaker & Camera Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700 mr-2" />
            <div className="w-10 h-1 rounded-full bg-slate-800" />
          </div>

          {/* Android Screen Container */}
          <div
            onClick={handlePhoneScreenClick}
            className="relative w-full h-full bg-[#090D16] rounded-[34px] overflow-hidden flex flex-col text-slate-100 font-sans"
          >
            {/* Status Bar */}
            <div className="pt-3 px-6 pb-2 flex justify-between items-center text-xs text-slate-400 font-mono tracking-tight shrink-0 z-40 bg-slate-950/40 backdrop-blur-sm">
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-emerald-400 font-bold">5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 px-5 py-3 overflow-y-auto space-y-4">
              {/* App Bar */}
              <div className="flex items-center justify-between pt-1">
                <div
                  onMouseDown={handleTitleMouseDown}
                  onMouseUp={handleTitleMouseUp}
                  onTouchStart={handleTitleMouseDown}
                  onTouchEnd={handleTitleMouseUp}
                  className="cursor-pointer group"
                  title="Long-press to open Admin Licensing Console"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
                      {t.appName}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                      v1.0
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Intelligent Floating Overlay
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Language switch quick button */}
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, language: prev.language === 'en' ? 'bn' : 'en' }))}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 text-xs flex items-center gap-1"
                    title="Switch Language"
                  >
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[10px] font-bold">{config.language.toUpperCase()}</span>
                  </button>

                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300"
                    title="Settings"
                  >
                    <Settings className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>

              {/* RGB Gradient Animated Border Card (RgbBorderCardView) */}
              <div className="relative p-[2.5px] rounded-2xl animate-rgb shadow-lg shadow-cyan-950/30">
                <div className="bg-slate-900/95 rounded-[14px] p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
                      Status Diagnostics
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      SDK 34
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5 text-xs">
                    {/* Floating Service State */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Floating Service</span>
                      <span className={`font-semibold ${isFloatingServiceRunning ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {isFloatingServiceRunning ? t.serviceActive : t.serviceIdle}
                      </span>
                    </div>

                    {/* Overlay Permission */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Overlay Permission</span>
                      <button
                        onClick={() => setHasOverlayPermission(!hasOverlayPermission)}
                        className={`text-[11px] font-semibold underline decoration-dotted ${hasOverlayPermission ? 'text-emerald-400' : 'text-rose-400'}`}
                      >
                        {hasOverlayPermission ? t.granted : t.denied}
                      </button>
                    </div>

                    {/* Accessibility Permission */}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Accessibility Service</span>
                      <button
                        onClick={() => setHasAccessibilityPermission(!hasAccessibilityPermission)}
                        className={`text-[11px] font-semibold underline decoration-dotted ${hasAccessibilityPermission ? 'text-emerald-400' : 'text-amber-400'}`}
                      >
                        {hasAccessibilityPermission ? t.enabled : t.disabled}
                      </button>
                    </div>
                  </div>

                  {/* Summary Footer */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Target: ${config.amount.toFixed(2)}</span>
                    <span className="font-mono">Delay: {config.delayMs}ms</span>
                  </div>
                </div>
              </div>

              {/* Main Action: Toggle Floating Service */}
              <button
                onClick={() => {
                  if (!hasOverlayPermission) {
                    alert('Please grant Overlay Permission first to spawn the floating window.');
                    return;
                  }
                  setIsFloatingServiceRunning(!isFloatingServiceRunning);
                }}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                  isFloatingServiceRunning
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
                    : 'bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 shadow-cyan-950/40'
                }`}
              >
                {isFloatingServiceRunning ? (
                  <>
                    <Square className="w-4 h-4 fill-current" />
                    <span>{t.stopFloating}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{t.startFloating}</span>
                  </>
                )}
              </button>

              {/* Automation Targets Mock Screen Area */}
              <div className="relative mt-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800/70">
                <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center justify-between">
                  <span>Simulated Screen Surface</span>
                  <span className="text-[10px] text-cyan-400 font-mono">360x740px</span>
                </div>

                {/* Target Button A Mockup */}
                <div
                  className="mb-2 p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between text-xs cursor-pointer hover:border-emerald-400"
                  onClick={() => setConfig(prev => ({ ...prev, buttonAX: 180, buttonAY: 490 }))}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-emerald-300 font-bold">Button A (UP)</span>
                  </div>
                  <span className="text-emerald-400/80 font-mono text-[11px]">
                    ({config.buttonAX}, {config.buttonAY})
                  </span>
                </div>

                {/* Target Button B Mockup */}
                <div
                  className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/50 flex items-center justify-between text-xs cursor-pointer hover:border-rose-400"
                  onClick={() => setConfig(prev => ({ ...prev, buttonBX: 180, buttonBY: 560 }))}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="text-rose-300 font-bold">Button B (DOWN)</span>
                  </div>
                  <span className="text-rose-400/80 font-mono text-[11px]">
                    ({config.buttonBX}, {config.buttonBY})
                  </span>
                </div>
              </div>

              {/* Safety Instructions */}
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/50 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Safety Guard Enabled</span>
                </div>
                <p>
                  Automation will halt automatically if {config.maxActions} actions are reached.
                </p>
              </div>

              {/* Admin console hint */}
              <div className="text-center pt-1 pb-4">
                <button
                  onClick={() => setShowAdminModal(true)}
                  className="text-[11px] text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  Admin Console (Long-press title)
                </button>
              </div>
            </div>

            {/* Simulated Animated Tap Gesture Indicator (dispatchGesture ripple) */}
            {activeTapPoint && (
              <div
                className="absolute pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{ left: `${activeTapPoint.x}px`, top: `${activeTapPoint.y}px` }}
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-400/30 animate-ping absolute" />
                  <div className="w-6 h-6 rounded-full bg-cyan-400 border-2 border-white shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="absolute -bottom-5 whitespace-nowrap text-[9px] font-bold bg-slate-900/90 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/40 shadow">
                    Tap: {activeTapPoint.label}
                  </span>
                </div>
              </div>
            )}

            {/* Position Picker Interceptor Overlay */}
            {pickingTarget && (
              <div className="absolute inset-0 bg-black/75 z-50 flex flex-col items-center justify-start pt-16 px-4 cursor-crosshair">
                <div className="bg-slate-900 border border-cyan-400 p-3 rounded-xl text-center shadow-xl max-w-[280px]">
                  <Target className="w-6 h-6 text-cyan-400 mx-auto mb-1 animate-pulse" />
                  <p className="text-xs font-bold text-slate-100">
                    Tap screen to set Button {pickingTarget} target
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Coordinates will be saved to DataStore
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPickingTarget(null);
                    }}
                    className="mt-2 text-[10px] text-rose-400 font-semibold underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Floating Service Overlay / Bubble Window */}
            {isFloatingServiceRunning && (
              <div
                className="absolute z-40 transition-shadow"
                style={{ left: `${floatPos.x}px`, top: `${floatPos.y}px` }}
              >
                {isOverlayExpanded ? (
                  /* Expanded Floating Overlay Panel */
                  <div className="w-52 bg-slate-900/95 backdrop-blur-md rounded-2xl border-2 border-cyan-500/80 shadow-2xl shadow-cyan-950/60 p-3 text-slate-100 font-sans select-none">
                    {/* Floating Header with Drag Handle */}
                    <div
                      onMouseDown={handleDragStart}
                      onTouchStart={handleDragStart}
                      className="flex items-center justify-between pb-1.5 border-b border-slate-800 cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        <span className="text-[11px] font-black tracking-wider text-cyan-400">
                          AUTO AI LITE
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setIsOverlayExpanded(false)}
                          className="p-1 text-slate-400 hover:text-white rounded"
                          title="Collapse to bubble"
                        >
                          <Minimize2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setIsFloatingServiceRunning(false)}
                          className="p-1 text-rose-400 hover:text-rose-300 rounded"
                          title="Close service"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Sweeping Scan Animation View & Signal Box */}
                    <div className="relative h-16 bg-slate-950/90 rounded-lg border border-slate-800 mt-2 overflow-hidden flex flex-col items-center justify-center">
                      {/* Sweeping Laser Line when Analysing */}
                      {(isAutoRunning || currentSignal === 'ANALYSING') && (
                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00d2ff] animate-scan pointer-events-none" />
                      )}

                      {/* Signal and Countdown Display */}
                      <div className="text-center z-10 px-1">
                        <span
                          className={`text-sm font-black tracking-wide ${
                            currentSignal === 'UP'
                              ? 'text-emerald-400'
                              : currentSignal === 'DOWN'
                              ? 'text-rose-400'
                              : currentSignal === 'WAIT'
                              ? 'text-amber-400'
                              : currentSignal === 'ANALYSING'
                              ? 'text-cyan-400 animate-pulse'
                              : 'text-slate-400'
                          }`}
                        >
                          {currentSignal}
                        </span>
                        <div className="text-[11px] font-mono text-slate-300">
                          {countdown !== null ? `Timer: ${countdown}s` : currentSignal === 'ANALYSING' ? 'Analysing...' : 'Idle'}
                        </div>
                      </div>
                    </div>

                    {/* Action Count Progress */}
                    <div className="mt-1.5 text-center text-[10px] text-slate-400 font-mono">
                      {t.actionsProgress(actionCount, config.maxActions)}
                    </div>

                    {/* Start / Stop Auto Toggle */}
                    <button
                      onClick={() => {
                        if (!hasAccessibilityPermission) {
                          alert('Accessibility service is required to dispatch tap gestures.');
                          return;
                        }
                        setIsAutoRunning(!isAutoRunning);
                      }}
                      className={`w-full mt-2 py-2 rounded-lg text-xs font-bold transition-colors ${
                        isAutoRunning
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/40'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/40'
                      }`}
                    >
                      {isAutoRunning ? t.stopAuto : t.startAuto}
                    </button>
                  </div>
                ) : (
                  /* Collapsed Floating Bubble */
                  <div
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    onClick={() => setIsOverlayExpanded(true)}
                    className="w-12 h-12 rounded-full bg-slate-900 border-2 border-cyan-400 shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                    title="Tap to expand"
                  >
                    <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Device Label */}
        <div className="mt-3 text-center text-xs text-slate-500 font-mono">
          Virtual Device: Android 14 (API 34)
        </div>
      </div>

      {/* Simulator Controls & Real-Time Engine Inspector */}
      <div className="w-full max-w-xl space-y-4">
        {/* Live Decision Engine Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-slate-100 text-sm">
                Pluggable Signal Engine Telemetry
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              {config.engineType === 'gemini' ? 'Gemini 2.5 Flash' : 'Algorithmic Oscillator'}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Current Decision</span>
              <span className={`text-base font-black ${
                currentSignal === 'UP' ? 'text-emerald-400' :
                currentSignal === 'DOWN' ? 'text-rose-400' :
                currentSignal === 'WAIT' ? 'text-amber-400' : 'text-slate-300'
              }`}>
                {currentSignal}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400 block text-[11px]">Confidence Score</span>
              <span className="text-base font-mono font-bold text-cyan-400">
                {(signalConfidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
            <span className="text-slate-400 block text-[11px] mb-1">Reasoning / Technical Logic</span>
            <p className="text-slate-300 leading-relaxed font-mono text-[11px]">
              {signalReason}
            </p>
          </div>
        </div>

        {/* Quick Simulator Triggers */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Interactive Simulator Toggles</span>
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setHasOverlayPermission(!hasOverlayPermission)}
              className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-left"
            >
              <span className="text-slate-400 block text-[10px]">Toggle Overlay Permission</span>
              <span className={hasOverlayPermission ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                {hasOverlayPermission ? 'Granted' : 'Revoked'}
              </span>
            </button>

            <button
              onClick={() => setHasAccessibilityPermission(!hasAccessibilityPermission)}
              className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-left"
            >
              <span className="text-slate-400 block text-[10px]">Toggle Accessibility</span>
              <span className={hasAccessibilityPermission ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                {hasAccessibilityPermission ? 'Service Connected' : 'Service Disabled'}
              </span>
            </button>

            <button
              onClick={() => {
                setShowSettingsModal(true);
              }}
              className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left"
            >
              <span className="text-slate-400 block text-[10px]">Settings &amp; Coordinates</span>
              <span className="text-cyan-400 font-semibold">Open Settings</span>
            </button>

            <button
              onClick={() => setShowAdminModal(true)}
              className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-left"
            >
              <span className="text-slate-400 block text-[10px]">Admin Licensing Panel</span>
              <span className="text-indigo-400 font-semibold">View Firestore Users</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal (DataStore Simulator) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-400" />
                <span>{t.settingsTitle}</span>
              </h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Coordinates */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-emerald-400 block mb-1">
                  Button A Coordinates (UP Action)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={config.buttonAX}
                    onChange={e => setConfig({ ...config, buttonAX: Number(e.target.value) })}
                    className="w-1/3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="X"
                  />
                  <input
                    type="number"
                    value={config.buttonAY}
                    onChange={e => setConfig({ ...config, buttonAY: Number(e.target.value) })}
                    className="w-1/3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="Y"
                  />
                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      setPickingTarget('A');
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-3 py-2 text-xs font-bold"
                  >
                    Pick on Screen
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-rose-400 block mb-1">
                  Button B Coordinates (DOWN Action)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={config.buttonBX}
                    onChange={e => setConfig({ ...config, buttonBX: Number(e.target.value) })}
                    className="w-1/3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="X"
                  />
                  <input
                    type="number"
                    value={config.buttonBY}
                    onChange={e => setConfig({ ...config, buttonBY: Number(e.target.value) })}
                    className="w-1/3 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    placeholder="Y"
                  />
                  <button
                    onClick={() => {
                      setShowSettingsModal(false);
                      setPickingTarget('B');
                    }}
                    className="flex-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg px-3 py-2 text-xs font-bold"
                  >
                    Pick on Screen
                  </button>
                </div>
              </div>
            </div>

            {/* Automation Parameters */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Target Amount ($)</label>
                <input
                  type="number"
                  value={config.amount}
                  onChange={e => setConfig({ ...config, amount: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Action Delay (ms)</label>
                <input
                  type="number"
                  value={config.delayMs}
                  onChange={e => setConfig({ ...config, delayMs: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-amber-400 font-bold block mb-1">Max Actions (Safety Limit)</label>
                <input
                  type="number"
                  value={config.maxActions}
                  onChange={e => setConfig({ ...config, maxActions: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-amber-400 font-bold block mb-1">Stop After N Losses</label>
                <input
                  type="number"
                  value={config.stopAfterLosses}
                  onChange={e => setConfig({ ...config, stopAfterLosses: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>

            {/* Engine Selection */}
            <div className="space-y-2 text-xs">
              <label className="text-slate-300 block">Signal Engine</label>
              <select
                value={config.engineType}
                onChange={e => setConfig({ ...config, engineType: e.target.value as 'gemini' | 'placeholder' })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              >
                <option value="gemini">Gemini AI (REST API)</option>
                <option value="placeholder">Algorithmic Oscillator (Offline)</option>
              </select>
            </div>

            {/* Gemini API Key */}
            <div className="space-y-1 text-xs">
              <label className="text-slate-300 block flex items-center justify-between">
                <span>Gemini API Key (EncryptedSharedPreferences)</span>
                <span className="text-[10px] text-cyan-400">Saved securely</span>
              </label>
              <input
                type="password"
                value={config.apiKey}
                onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>

            {/* Language */}
            <div className="space-y-2 text-xs">
              <label className="text-slate-300 block">Language / ভাষা</label>
              <select
                value={config.language}
                onChange={e => setConfig({ ...config, language: e.target.value as 'en' | 'bn' })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
              >
                <option value="en">English</option>
                <option value="bn">বাংলা (Bangla)</option>
              </select>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Admin Panel Modal (Firestore Licensing Console) */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span>Admin Licensing Panel</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Backed by Firebase Auth &amp; Firestore 'licenses' collection
                </p>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* License list */}
            <div className="space-y-3">
              {adminUsers.map(u => (
                <div
                  key={u.uid}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{u.deviceModel}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'Active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : u.status === 'Blocked'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {u.status}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-500">UID: {u.uid}</p>
                    <p className="text-[11px] text-slate-400">
                      Expires: {u.expiryDate} · Actions: {u.totalActions}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setAdminUsers(adminUsers.map(x => x.uid === u.uid ? {
                          ...x,
                          expiryDate: '2027-01-31',
                          status: 'Active'
                        } : x));
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500 text-[11px] text-cyan-400"
                    >
                      +30 Days
                    </button>
                    <button
                      onClick={() => {
                        setAdminUsers(adminUsers.map(x => x.uid === u.uid ? {
                          ...x,
                          status: x.status === 'Active' ? 'Blocked' : 'Active'
                        } : x));
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold ${
                        u.status === 'Active'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800 hover:bg-rose-900'
                          : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900'
                      }`}
                    >
                      {u.status === 'Active' ? 'Block' : 'Unblock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center text-xs text-slate-500">
              <span>{adminUsers.length} total device records</span>
              <button
                onClick={() => {
                  const newUid = `usr_dev_${Math.floor(Math.random() * 900 + 100)}`;
                  setAdminUsers([
                    ...adminUsers,
                    {
                      uid: newUid,
                      deviceModel: 'Motorola Edge 50',
                      appVersion: '1.0.0',
                      status: 'Active',
                      expiryDate: '2026-12-31',
                      totalActions: 0
                    }
                  ]);
                }}
                className="text-cyan-400 hover:underline"
              >
                + Register New Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
