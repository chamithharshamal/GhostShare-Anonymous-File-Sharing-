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
  bgColor = '#ffffff', 
  fgColor = '#000000' 
}: QRCodeDisplayProps) {
  return (
    <div className="flex justify-center p-4 bg-white rounded-lg">
      <QRCodeSVG 
        value={value} 
        size={size} 
        bgColor={bgColor}
        fgColor={fgColor}
        level="H" // High error correction level for better scanning
        includeMargin={true} // Include margin for better scanning
        marginSize={4} // Add margin around the QR code
      />
    </div>
  )
}