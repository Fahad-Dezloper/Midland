"use client"

import { getBannerImages } from 'lib/shopify'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

interface SliderImage {
    handle: string
  id: string
  image: {
    altText: string | null
    height: number
    url: string
    width: number
  }
}

interface BannerSliderProps {
  images?: SliderImage[]
  autoSlideInterval?: number
  className?: string
}

const fetchBannerImages = async () => {
      const bannerImages = await getBannerImages();
      return bannerImages
}

const BannerSlider: React.FC<BannerSliderProps> = ({
  autoSlideInterval = 2000,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [images, setImages] = useState<SliderImage[]>([])
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isArrowVisible, setIsArrowVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetchBannerImages();
      setImages(res as SliderImage[]);
    };
    fetchImages();
  }, [])

  const nextSlide = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }
  }, [images.length])

  const prevSlide = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }
  }, [images.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-slide effect
  useEffect(() => {
    if (images.length > 0 && !isHovered) {
      const interval = setInterval(nextSlide, autoSlideInterval)
      return () => clearInterval(interval)
    }
  }, [nextSlide, autoSlideInterval, isHovered, images.length])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2

    setCursorPosition({ x, y })
    
    const shouldShowLeft = x < centerX
    const shouldShowRight = x >= centerX

    setShowLeftArrow(shouldShowLeft)
    setShowRightArrow(shouldShowRight)
    setIsArrowVisible(true)
  }

  const handleMouseLeave = () => {
    if (isMobile) return
    
    setShowLeftArrow(false)
    setShowRightArrow(false)
    setIsArrowVisible(false)
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    if (isMobile) return
    setIsHovered(true)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isMobile) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const centerX = rect.width / 2

    if (x < centerX) {
      prevSlide()
    } else {
      nextSlide()
    }
  }

  // Don't render if no images
  if (images.length === 0) {
    return (
      <div className={`relative w-full md:h-[45vh] h-[20vh] overflow-hidden rounded-lg bg-background ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full md:h-[45vh] h-[20vh] overflow-hidden rounded-lg bg-background ${className}`}>
      <div
        ref={containerRef}
        className={`relative w-full h-full ${isMobile ? 'cursor-default' : 'cursor-none'}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
      >
        <div
          className="flex w-full h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image) => (
            <div key={image.id} className="w-full h-full flex-shrink-0">
              <img
                src={image.image.url}
                alt={image.image.altText || ''}
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Custom cursor arrow - only on desktop */}
        {!isMobile && isArrowVisible && (showLeftArrow || showRightArrow) && (
          <div
            className="absolute pointer-events-none z-50 transition-all duration-150 ease-out"
            style={{
              left: Math.max(0, Math.min(cursorPosition.x - 12, containerRef.current?.clientWidth || 0 - 24)),
              top: Math.max(0, Math.min(cursorPosition.y - 12, containerRef.current?.clientHeight || 0 - 24)),
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            {showLeftArrow && (
              <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                <ChevronLeft className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
            )}
            {showRightArrow && (
              <div className="w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                <ChevronRight className="w-5 h-5 text-white drop-shadow-lg" />
              </div>
            )}
          </div>
        )}

        {/* Fixed navigation arrows - always visible */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:hidden top-1/2 transform -translate-y-1/2 z-40 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-lg hover:bg-black/60 transition-all duration-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-white drop-shadow-lg" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 md:hidden top-1/2 transform -translate-y-1/2 z-40 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-lg hover:bg-black/60 transition-all duration-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-white drop-shadow-lg" />
        </button>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white scale-110'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default BannerSlider