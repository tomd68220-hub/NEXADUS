'use client';

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        className={`toggle-switch ${checked ? 'active' : ''}`}
      />
      {label && (
        <span style={{
          fontSize: '0.82rem',
          fontWeight: 300,
          color: checked ? 'var(--light)' : 'var(--grey)',
          transition: 'color 0.2s',
          textTransform: 'none',
          letterSpacing: 'normal',
        }}>
          {label}
        </span>
      )}
    </label>
  );
}
