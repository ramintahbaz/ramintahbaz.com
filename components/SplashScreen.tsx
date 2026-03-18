'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [showSecond, setShowSecond] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSecond(true), 700);
    const t2 = setTimeout(() => {
      setVisible(false);
    }, 2600);
    const t3 = setTimeout(() => onComplete(), 3200);
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
            background: 'transparent',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            paddingBottom: isMobile ? 48 : 'clamp(80px, 12vw, 162px)',
            paddingLeft: isMobile ? 20 : 'clamp(24px, 4vw, 77px)',
            paddingRight: isMobile ? 12 : 'clamp(24px, 4vw, 48px)',
            textAlign: 'left',
            direction: 'ltr',
          }}
        >
          <div
            style={{
              maxWidth: 480,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              gap: 4,
              minHeight: isMobile ? '3em' : '4.5em',
            }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                fontSize: isMobile ? '13px' : 'clamp(14px, 2.5vw, 18px)',
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
                    margin: 0,
                    fontSize: isMobile ? 'clamp(12px, 2vw, 14px)' : 'clamp(11px, 1.8vw, 15px)',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'var(--font-geist-mono), monospace',
                    fontWeight: 400,
                    lineHeight: 1.5,
                  }}
                >
                  Design engineer at Promise.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
