'use client';

interface GoldTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export default function GoldTitle({ children, className = '', as: Tag = 'h1' }: GoldTitleProps) {
  return (
    <Tag
      className={`font-bold tracking-[6px] ${className}`}
      style={{
        fontFamily: "'Ma Shan Zheng', cursive",
        background: 'linear-gradient(180deg, #f0d890, #d4a853)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {children}
    </Tag>
  );
}
