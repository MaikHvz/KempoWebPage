'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      richColors
      toastOptions={{
        style: {
          fontFamily: 'var(--font-montserrat), sans-serif',
          fontSize: '14px',
          borderRadius: '12px',
        },
      }}
    />
  );
}
