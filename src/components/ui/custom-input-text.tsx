'use client'

import React from 'react'

interface CustomInputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const CustomInputText = React.forwardRef<HTMLInputElement, CustomInputTextProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <input
          type="text"
          ref={ref}
          className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 ${className}`}
          {...props}
        />
      </div>
    )
  }
)

CustomInputText.displayName = 'CustomInputText'