'use client'

import React from 'react'

interface CustomInputDateTimeProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export const CustomInputDateTime = React.forwardRef<HTMLInputElement, CustomInputDateTimeProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 text-left">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <input
          type="datetime-local"
          ref={ref}
          className={`flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:focus-visible:ring-slate-300 ${className}`}
          {...props}
        />
      </div>
    )
  }
)

CustomInputDateTime.displayName = 'CustomInputDateTime'