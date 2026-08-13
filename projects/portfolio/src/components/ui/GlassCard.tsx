import { type ReactNode } from 'react';

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag-pill">{children}</span>;
}

export function TechTag({ children }: { children: ReactNode }) {
  return <span className="tech-tag">{children}</span>;
}
