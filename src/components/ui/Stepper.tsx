'use client';

interface StepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  label?: string;
}

export function Stepper({ value, min = 1, max = 99, onChange, label }: StepperProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          style={{
            width: '40px',
            height: '40px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--light)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >
          −
        </button>
        <div style={{
          width: '56px',
          height: '40px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderLeft: 'none',
          borderRight: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: 'var(--white)',
        }}>
          {value}
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          style={{
            width: '40px',
            height: '40px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--light)',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
