'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const NeuralPortfolio = dynamic(() => import('@/components/NeuralPortfolio'), { ssr: false });

export default function NeuralPortfolioLayer() {
  const pathname = usePathname();
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        display: pathname === '/' && !pathname.startsWith('/work/') ? 'block' : 'none',
      }}
    >
      <NeuralPortfolio />
    </div>
  );
}
