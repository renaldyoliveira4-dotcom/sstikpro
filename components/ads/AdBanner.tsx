interface AdBannerProps {
  placement: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function AdBanner({ placement, size = 'md', className = '' }: AdBannerProps) {
  const heights = {
    sm: 'h-14',
    md: 'h-20 md:h-24',
    lg: 'h-24 md:h-32',
  }

  return (
    <div className={`w-full ${className}`}>
      <div className={`ad-placeholder rounded-lg w-full ${heights[size]} text-xs`}>
        AD — {placement}
      </div>
    </div>
  )
}
