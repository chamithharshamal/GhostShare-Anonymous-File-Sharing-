'use client'

import { QRCodeSVG } from 'qrcode.react'

interface QRCodeDisplayProps {
  value: string
  size?: number
  bgColor?: string
  fgColor?: string
}

export default function QRCodeDisplay({ 
  value, 
  size = 150, 
  bgColor = '#1f2937', 
  fgColor = '#ffffff' 
}: QRCodeDisplayProps) {
  return (
    <div className="flex justify-center p-3 bg-white rounded-lg">
      <QRCodeSVG 
        value={value} 
        size={size} 
        bgColor={bgColor}
        fgColor={fgColor}
        level="H"
        includeMargin={false}
      />
    </div>
  )
}