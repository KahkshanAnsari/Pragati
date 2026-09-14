import React from 'react';
import { HelpCircle, X, Mail, Phone } from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpSupportModal({ isOpen, onClose }: HelpSupportModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm mx-4 p-7 sm:p-8 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* PRAGATI Support Icon */}
        <div className="mb-4 flex justify-center">
          <div className="w-12 h-12 rounded-full bg-[#123158] flex items-center justify-center shadow-xs">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-[#0F2747] mb-1">PRAGATI Support Desk</h2>
        <p className="text-xs text-slate-500 mb-6">Government Innovation & Procurement Platform</p>

        {/* Contact Details */}
        <div className="space-y-3 text-sm text-left">
          <div className="bg-blue-50/80 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Email</p>
              <a
                href="mailto:support@pragati.gov.in"
                className="font-semibold text-[#0F2747] hover:text-blue-700 transition-colors text-xs truncate block"
              >
                support@pragati.gov.in
              </a>
            </div>
          </div>

          <div className="bg-blue-50/80 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Toll Free</p>
              <p className="font-semibold text-[#0F2747] text-xs">1800-11-2026</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full bg-[#0E2442] hover:bg-[#16335a] text-white font-bold py-2.5 px-4 text-xs rounded-lg transition-all cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default HelpSupportModal;
