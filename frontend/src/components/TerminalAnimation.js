import React, { useState, useEffect, useRef } from 'react';

// ─── Matrix Rain Background ─────────────────────────────────────────────
const MatrixRain = ({ fullscreen = false, opacity = 0.3 }) => {
  const canvasRef = useRef(null);
  const dropsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const parent = fullscreen ? document.documentElement : canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = fullscreen ? window.innerHeight : parent.clientHeight;
      // Reset drops on resize
      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);
      dropsRef.current = Array(columns).fill(1);
    };

    resize();
    window.addEventListener('resize', resize);

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()アイウエオカキクケコサシスセソ<>{}[]=/\\';
    const fontSize = 14;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      const drops = dropsRef.current;

      ctx.fillStyle = 'rgba(18, 18, 18, 0.06)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const brightness = Math.random();
        if (brightness > 0.96) {
          ctx.fillStyle = '#FFFFFF';
        } else if (brightness > 0.85) {
          ctx.fillStyle = '#FF9100';
        } else {
          ctx.fillStyle = `rgba(255, 145, 0, ${0.08 + Math.random() * 0.2})`;
        }

        ctx.fillText(char, x, y);

        if (y > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 45);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [fullscreen]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={{
        position: fullscreen ? 'fixed' : 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity,
        zIndex: fullscreen ? 0 : 'auto',
      }}
    />
  );
};

// ─── Typewriter Effect ──────────────────────────────────────────────────
const TypewriterText = ({ text, speed = 50, delay = 0, className = '', onComplete }) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else {
      setDone(true);
      onComplete?.();
    }
  }, [displayed, started, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {started && !done && <span className="terminal-cursor">█</span>}
    </span>
  );
};

// ─── Terminal Boot Sequence ─────────────────────────────────────────────
const TerminalBootSequence = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const terminalRef = useRef(null);

  const bootLines = [
    { type: 'system', text: '> CYBERSTORE OS v4.2.0 — Initializing...', delay: 0 },
    { type: 'success', text: '[OK] Neural network connected', delay: 400 },
    { type: 'success', text: '[OK] Quantum encryption active', delay: 700 },
    { type: 'info', text: '[>>] Loading product matrix...', delay: 1000 },
    { type: 'success', text: '[OK] 500+ weapons loaded', delay: 1400 },
    { type: 'info', text: '[>>] Syncing user profiles...', delay: 1700 },
    { type: 'success', text: '[OK] 10,000+ operatives online', delay: 2100 },
    { type: 'warning', text: '[!!] Flash sale detected — 40% OFF', delay: 2500 },
    { type: 'system', text: '> System ready. Welcome, Operative.', delay: 3000 },
  ];

  useEffect(() => {
    const timers = bootLines.map((line, index) =>
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        setCurrentLine(index);
      }, line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const colorMap = {
    system: 'text-aliexpress-white',
    success: 'text-green-400',
    info: 'text-aliexpress-red',
    warning: 'text-yellow-400 font-bold animate-pulse',
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-aliexpress-border shadow-lg shadow-aliexpress-red/10">
      {/* Terminal Title Bar */}
      <div className="flex items-center px-4 py-2 bg-aliexpress-darkgray border-b border-aliexpress-border">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs font-mono text-aliexpress-medgray">cyberstore@terminal — bash</span>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        className="relative bg-aliexpress-black p-4 font-mono text-sm h-56 overflow-y-auto"
      >
        <MatrixRain opacity={0.25} />
        <div className="relative z-10 space-y-1">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`terminal-line-enter ${colorMap[line.type]}`}
            >
              {line.text}
            </div>
          ))}
          {currentLine === bootLines.length - 1 && (
            <div className="mt-2 text-aliexpress-red terminal-line-enter">
              {'> '}<span className="terminal-cursor">█</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Glitch Text ────────────────────────────────────────────────────────
const GlitchText = ({ children, className = '' }) => {
  return (
    <span className={`glitch-text ${className}`} data-text={children}>
      {children}
    </span>
  );
};

// ─── Scanning Bar ───────────────────────────────────────────────────────
const ScanningBar = () => (
  <div className="scanning-bar-container">
    <div className="scanning-bar"></div>
  </div>
);

// ─── Cyber Counter ──────────────────────────────────────────────────────
const CyberCounter = ({ end, duration = 2000, prefix = '', suffix = '', className = '' }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// ─── HUD Corner Decorations ────────────────────────────────────────────
const HudCorners = ({ children, className = '' }) => (
  <div className={`relative ${className}`}>
    {/* Top-left */}
    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-aliexpress-red"></div>
    {/* Top-right */}
    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-aliexpress-red"></div>
    {/* Bottom-left */}
    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-aliexpress-red"></div>
    {/* Bottom-right */}
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-aliexpress-red"></div>
    {children}
  </div>
);

// ─── Pulse Dot ──────────────────────────────────────────────────────────
const PulseDot = ({ color = 'bg-green-400', label = 'ONLINE' }) => (
  <div className="flex items-center space-x-2">
    <span className="relative flex h-3 w-3">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`}></span>
    </span>
    <span className="text-xs font-mono text-aliexpress-medgray uppercase tracking-widest">{label}</span>
  </div>
);

// ─── Data Stream ────────────────────────────────────────────────────────
const DataStream = () => {
  const [packets, setPackets] = useState([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const hexChars = '0123456789ABCDEF';
      const packet = Array.from({ length: 8 }, () => 
        hexChars[Math.floor(Math.random() * 16)] + hexChars[Math.floor(Math.random() * 16)]
      ).join(' ');
      
      setPackets(prev => {
        const next = [...prev, { id: Date.now(), data: packet }];
        return next.slice(-6); // Keep last 6 packets
      });
    }, 800);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="font-mono text-xs space-y-1 overflow-hidden">
      {packets.map((p) => (
        <div key={p.id} className="terminal-line-enter flex items-center space-x-2">
          <span className="text-aliexpress-red">0x</span>
          <span className="text-aliexpress-medgray">{p.data}</span>
          <span className="text-green-400 ml-auto">✓</span>
        </div>
      ))}
    </div>
  );
};

export {
  MatrixRain,
  TypewriterText,
  TerminalBootSequence,
  GlitchText,
  ScanningBar,
  CyberCounter,
  HudCorners,
  PulseDot,
  DataStream
};
