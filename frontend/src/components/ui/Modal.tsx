import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ModalProps {
  open?: boolean;
  /** Alias for open — accepted for backward compat */
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Modal({ open, isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const isVisible = open ?? isOpen ?? false;
  const sizes = {
    sm:  'max-w-sm',
    md:  'max-w-md',
    lg:  'max-w-lg',
    xl:  'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <Dialog.Root open={isVisible} onOpenChange={(v) => { if (!v) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2',
            'rounded-xl bg-white p-6 shadow-xl border border-gray-200',
            sizes[size]
          )}
        >
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
            <Dialog.Title className="text-lg font-bold text-gray-900">{title}</Dialog.Title>
            <Dialog.Close
              className="rounded-full p-1 hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <X className="h-5 w-5 text-gray-500" />
            </Dialog.Close>
          </div>
          <div>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
