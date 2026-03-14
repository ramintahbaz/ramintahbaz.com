'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [showSecond, setShowSecond] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSecond(true), 1200);
    const t2 = setTimeout(() => {
      setVisible(false);
    }, 3100);
    const t3 = setTimeout(() => onComplete(), 3700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#000',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            paddingTop: (isMobile ?? false) ? 24 : 48,
            paddingRight: (isMobile ?? false) ? 24 : 48,
            paddingBottom: (isMobile ?? false) ? 80 : 162,
            paddingLeft: (isMobile ?? false) ? 24 : 77,
            textAlign: 'left',
            direction: 'ltr',
          }}
        >
          <div style={{ maxWidth: 480, position: 'relative' }}>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontSize: (isMobile ?? false) ? 'clamp(14px, 2.5vw, 16px)' : 'clamp(15px, 2vw, 18px)',
                color: 'rgba(255,255,255,0.9)',
                fontFamily: 'var(--font-geist-sans), sans-serif',
                fontWeight: 400,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Welcome to the neural network of Ramin Tahbaz.
            </motion.p>

            <AnimatePresence>
              {showSecond && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    marginTop: 2,
                    left: 0,
                    fontSize: (isMobile ?? false) ? 'clamp(11px, 2vw, 12px)' : 'clamp(13px, 1.6vw, 15px)',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  Design engineer based in Washington, DC.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
