import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/* Individual toast item */
function ToastItem({ toast, onDismiss }) {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), toast.duration ?? 3500);
    return () => clearTimeout(timerRef.current);
  }, [toast.id, toast.duration, onDismiss]);

  const isError = toast.type === 'error';

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        'flex items-start gap-3 rounded-2xl px-4 py-3 shadow-2xl ring-1 backdrop-blur-md',
        'animate-toast-in min-w-[260px] max-w-[360px]',
        isError
          ? 'bg-rose-950/90 ring-rose-500/30 text-rose-100'
          : 'bg-slate-900/95 ring-emerald-500/30 text-white',
      ].join(' ')}
    >
      {/* Icon */}
      <span
        className={[
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold',
          isError ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950',
        ].join(' ')}
      >
        {isError ? '✕' : '✓'}
      </span>

      {/* Message */}
      <p className="flex-1 text-sm leading-snug">{toast.message}</p>

      {/* Close */}
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="ml-1 mt-0.5 shrink-0 text-slate-400 transition hover:text-white"
      >
        ✕
      </button>
    </div>
  );
}

/* Container that renders all active toasts into a portal */
export default function ToastContainer({ toasts, onDismiss }) {
  return createPortal(
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>,
    document.body,
  );
}
