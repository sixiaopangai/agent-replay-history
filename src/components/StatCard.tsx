'use client';

interface StatCardProps {
  value: number | string;
  label: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatCard({ value, label, color = 'var(--color-gold)', size = 'md' }: StatCardProps) {
  const valueSize = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-base' : 'text-sm';
  const labelSize = size === 'lg' ? 'text-[10px]' : 'text-[9px]';

  return (
    <div className="text-center">
      <div className={`${valueSize} font-bold`} style={{ color }}>{value}</div>
      <div className={`${labelSize} text-[var(--color-text-dim)] tracking-wider`}>{label}</div>
    </div>
  );
}
