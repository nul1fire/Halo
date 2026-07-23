import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [mediaData, setMediaData] = useState<any>(null);
  const [clockTime, setClockTime] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [batteryData, setBatteryData] = useState<{ charging: boolean; level: number } | null>(null);
  const [showBattery, setShowBattery] = useState(false);
  const [clipboardData, setClipboardData] = useState<string | null>(null);

  const [mode, setMode] = useState<'cycle' | 'music' | 'clock' | 'idle'>('cycle');
  const [showMenu, setShowMenu] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }));
    };
    updateClock();
    const clockInt = setInterval(updateClock, 1000);
    return () => clearInterval(clockInt);
  }, []);

  useEffect(() => {
    window.halo.onMediaUpdate((data: any) => setMediaData(data));
    window.halo.onClipboardUpdate((text: string) => {
      setClipboardData(text);
      setTimeout(() => setClipboardData(null), 4000);
    });

    let battery: any;
    const updateBattery = () => {
      if (battery) {
        setBatteryData({ charging: battery.charging, level: Math.round(battery.level * 100) });
        setShowBattery(true);
        setTimeout(() => setShowBattery(false), 4000);
      }
    };
    if (navigator.getBattery) {
      navigator.getBattery().then((b) => {
        battery = b;
        updateBattery();
        b.addEventListener('chargingchange', updateBattery);
      });
    }
    return () => {
      if (battery) battery.removeEventListener('chargingchange', updateBattery);
    };
  }, []);

  useEffect(() => {
    if (mode === 'cycle') {
      const int = setInterval(() => setCycleIndex((prev) => (prev + 1) % 3), 5000);
      return () => clearInterval(int);
    }
  }, [mode]);

  let currentState = 'idle';
  if (clipboardData) currentState = 'clipboard';
  else if (showBattery && batteryData) currentState = 'battery';
  else if (mode === 'cycle') {
    const states = ['idle', 'clock', 'music'];
    currentState = states[cycleIndex];
    if (currentState === 'music' && !mediaData) currentState = 'demo-music'; 
  } else if (mode === 'music') currentState = mediaData ? 'music' : 'idle';
  else if (mode === 'clock') currentState = 'clock';

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <div style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)' }}>
        <motion.div 
          layout 
          drag
          dragMomentum={false}
          onMouseEnter={() => window.halo.toggleClickThrough(false)}
          onMouseLeave={() => window.halo.toggleClickThrough(true)}
          transition={{ layout: { type: "spring", damping: 25, stiffness: 300 } }}
          className="relative flex items-center bg-black text-white rounded-full overflow-visible"
          style={{ padding: '8px 12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {currentState === 'idle' && (
                <motion.div key="idle" className="flex items-center gap-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Halo</span>
                </motion.div>
              )}

              {currentState === 'clock' && (
                <motion.div key="clock" className="flex items-center gap-3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-medium">{clockTime}</span>
                    <span className="text-xs text-gray-400">{dateStr}</span>
                  </div>
                </motion.div>
              )}

              {(currentState === 'music' || currentState === 'demo-music') && (
                <motion.div key="music" className="flex items-center gap-3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-600 flex items-center justify-center">
                    {mediaData?.thumbnail ? <img src={`data:image/png;base64,${mediaData.thumbnail}`} className="w-full h-full object-cover pointer-events-none" draggable="false" /> : <svg width="20" height="20" viewBox="0 0 24 24" fill="white" opacity="0.5"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate max-w-[120px]">{mediaData?.title || 'Echoes'}</span>
                    <span className="text-xs text-gray-400 truncate max-w-[120px]">{mediaData?.artist || 'Halo System'}</span>
                  </div>
                  <div className="flex items-end gap-0.5 h-4 ml-2">
                    <motion.div className="w-1 bg-white rounded-full" animate={{ height: mediaData?.isPlaying ? ["20%", "100%", "40%"] : "30%" }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror" }}></motion.div>
                    <motion.div className="w-1 bg-white rounded-full" animate={{ height: mediaData?.isPlaying ? ["40%", "20%", "100%"] : "30%" }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror", delay: 0.2 }}></motion.div>
                    <motion.div className="w-1 bg-white rounded-full" animate={{ height: mediaData?.isPlaying ? ["100%", "40%", "20%"] : "30%" }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror", delay: 0.4 }}></motion.div>
                  </div>
                </motion.div>
              )}

              {currentState === 'clipboard' && (
                <motion.div key="clipboard" className="flex items-center gap-3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium">Скопировано</span>
                    <span className="text-xs text-gray-400 truncate max-w-[120px]">{clipboardData}</span>
                  </div>
                </motion.div>
              )}

              {currentState === 'battery' && batteryData && (
                <motion.div key="battery" className="flex items-center gap-3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={batteryData.charging ? '#4ADE80' : 'white'} stroke="none">
                    {batteryData.charging ? <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" /> : <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />}
                  </svg>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium">{batteryData.charging ? 'Заряжается' : 'Батарея'}</span>
                    <span className="text-xs text-gray-400">{batteryData.level}%</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-shrink-0 ml-2 cursor-pointer relative" onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" opacity="0.5"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
          </div>
        </motion.div>

        <AnimatePresence>
          {showMenu && (
            <motion.div 
              drag
              dragMomentum={false}
              onMouseEnter={() => window.halo.toggleClickThrough(false)}
              onMouseLeave={() => window.halo.toggleClickThrough(true)}
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 10 }} 
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 bg-zinc-900 rounded-xl p-2 shadow-2xl border border-zinc-800 w-44 z-50"
            >
              <div className="flex justify-between items-center px-2 py-1 mb-1 border-b border-zinc-800">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Настройки</span>
                <button onClick={() => setShowMenu(false)} className="text-gray-500 hover:text-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <button className="text-left px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-800 text-white transition-colors" onClick={() => { setMode('cycle'); setShowMenu(false); }}>Цикл</button>
                <button className="text-left px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-800 text-white transition-colors" onClick={() => { setMode('music'); setShowMenu(false); }}>Только Музыка</button>
                <button className="text-left px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-800 text-white transition-colors" onClick={() => { setMode('clock'); setShowMenu(false); }}>Только Часы</button>
                <button className="text-left px-3 py-1.5 text-sm rounded-lg hover:bg-zinc-800 text-white transition-colors" onClick={() => { setMode('idle'); setShowMenu(false); }}>Скрывать</button>
                <div className="h-px bg-zinc-800 my-1"></div>
                <button className="text-left px-3 py-1.5 text-sm rounded-lg hover:bg-red-900 text-red-400 transition-colors" onClick={() => window.halo.quitApp()}>Выход</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
