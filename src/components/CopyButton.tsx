'use client'

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/cn'

interface CopyButtonProps {
  value: string
  className?: string
}

const CopyButton: React.FC<CopyButtonProps> = ({ value, className }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      aria-label="Copy link"
      onClick={handleCopy}
      className={cn('flex items-center gap-4 hover:text-nano', className)}
    >
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
      <span className="sr-only">Copy</span>
    </button>
  )
}

export default CopyButton
