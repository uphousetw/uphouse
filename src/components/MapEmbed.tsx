interface MapEmbedProps {
  latitude: number
  longitude: number
  address?: string
  className?: string
}

export const MapEmbed = ({ latitude, longitude, address, className = '' }: MapEmbedProps) => {
  // 使用經緯度建立 Google Maps Embed URL (不需要 API key)
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&output=embed`

  return (
    <div className={className}>
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={address ? `${address} 的地圖位置` : '地圖位置'}
        className="rounded-2xl"
      />
    </div>
  )
}
