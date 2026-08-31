import { useState, useRef, useCallback, useEffect } from 'react'

const BASE = import.meta.env.BASE_URL

export default function QR() {
  const [isFs, setIsFs] = useState(false)
  const tapRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const enterFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.()
  }, [])

  const handleTap = useCallback(() => {
    if (!document.fullscreenElement) return
    tapRef.current += 1
    clearTimeout(timerRef.current)
    if (tapRef.current >= 2) {
      tapRef.current = 0
      document.exitFullscreen?.()
    } else {
      timerRef.current = setTimeout(() => { tapRef.current = 0 }, 400)
    }
  }, [])

  return (
    <div
      onClick={handleTap}
      style={{
        width: '100vw', height: '100dvh',
        background: '#090a0a',
        fontFamily: 'Pretendard, -apple-system, sans-serif',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 36, userSelect: 'none',
      }}
    >
      <div style={{ fontSize: 10, letterSpacing: '0.42em', color: '#7ab6af', fontWeight: 500 }}>
        ASTON MARTIN
      </div>

      <img
        src={`${BASE}images/qr-code.png`}
        alt="QR Code"
        style={{ width: 240, height: 240 }}
      />

      {!isFs && (
        <>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#f5f5f7', marginBottom: 8 }}>
              QR을 스캔해 주세요
            </div>
            <div style={{ fontSize: 12, color: '#525866', lineHeight: 1.7 }}>
              카메라로 스캔하시면 설문 페이지로 이동합니다
            </div>
          </div>

          <div
            onClick={(e) => { e.stopPropagation(); enterFullscreen() }}
            style={{
              position: 'absolute', bottom: 36,
              fontSize: 11, letterSpacing: '0.14em', color: '#525866',
              borderBottom: '1px solid rgba(255,255,255,0.14)',
              paddingBottom: 5, cursor: 'pointer',
            }}
          >
            전체보기
          </div>
        </>
      )}
    </div>
  )
}
