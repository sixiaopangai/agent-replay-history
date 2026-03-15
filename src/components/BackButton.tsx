'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  href: string;
  label?: string;
}

export default function BackButton({ href, label = '← 回到历史沙盒' }: BackButtonProps) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className="text-[11px] text-[var(--color-gold)] tracking-wider hover:opacity-70 transition-opacity"
    >
      {label}
    </button>
  );
}
