'use client'

import React from 'react'

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive'
  loading?: boolean
}

export const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ children, variant = 'default', loading = false, className, disabled, ...props }, ref) => {
    
    // จัดการสีของปุ่มตาม Variant สไตล์ Shadcn
    const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2'
    
    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90',
      outline: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50',
      destructive: 'bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90'
    }

    const currentVariant = variants[variant] || variants.default

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${baseStyles} ${currentVariant} ${className}`}
        {...props}
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            {/* ตัว Loading หมุนๆ มินิมอล */}
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>กำลังดำเนินการ...</span>
          </div>
        ) : (
          children
        )}
      </button>
    )
  }
)

CustomButton.displayName = 'CustomButton'