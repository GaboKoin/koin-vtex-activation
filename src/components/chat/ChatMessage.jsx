import ChatRichHtml from './ChatRichHtml.jsx';
import { cn } from '../../lib/cn.js';

export default function ChatMessage({ role, children, html, userInitials = 'Vos' }) {
  const isUser = role === 'user';
  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center text-xs font-bold',
          isUser
            ? 'rounded-lg bg-[var(--color-brand-light)] text-[var(--color-brand-600)] ring-1 ring-[var(--color-brand-mid)]'
            : 'rounded-lg bg-[var(--color-gray-900)] text-[var(--color-brand-600)]',
        )}
        aria-hidden
      >
        {isUser ? userInitials : 'K'}
      </div>
      <div
        className={cn(
          'max-w-[min(100%,42rem)] px-4 py-3 text-sm leading-relaxed shadow-sm',
          isUser
            ? 'rounded-[12px_4px_12px_12px] bg-[var(--color-gray-900)] text-white'
            : 'rounded-[4px_12px_12px_12px] border border-[var(--color-gray-200)] bg-white text-[var(--color-gray-800)]',
        )}
      >
        {html ? (
          <ChatRichHtml className="koin-chat-rich" html={html} />
        ) : (
          <div className={cn(isUser && 'text-white')}>{children}</div>
        )}
      </div>
    </div>
  );
}
