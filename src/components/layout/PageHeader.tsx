import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backAction?: { label: string; onClick: () => void };
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, backAction, actions }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 pt-4 pb-3">
      {backAction && (
        <button
          onClick={backAction.onClick}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mb-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {backAction.label}
        </button>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
