import { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
  condition: any;
}

export default function ({ children, condition }: PageProps) {
  return condition ? <>{children}</> : null;
}
