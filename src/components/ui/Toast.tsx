'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss: () => void;
}

export function ToastItem({ message, type = 'success', onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const borderColor = type === 'success' ? 'var(--green)' : type === 'error' ? '#ff6b6b' : 'var(--grey)';

  return (
    <div
      style={{
        background: 'var(--dark2)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderLeft: `3px solid ${borderColor}`,
        padding: '16px 20px',
        minWidth: '280px',
        maxWidth: '380px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s var(--ease), opacity 0.3s var(--ease)',
      }}
    >
      <span style={{
        fontSize: '0.82rem',
        fontWeight: 300,
        color: 'var(--light)',
        lineHeight: 1.5,
      }}>
        {message}
      </span>
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--grey)',
          cursor: 'pointer',
          padding: '0',
          fontSize: '1rem',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: { id: string; message: string; type?: 'success' | 'error' | 'info' }[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}
