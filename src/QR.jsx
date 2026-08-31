import { useRef, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const SURVEY_URL = import.meta.env.VITE_SURVEY_URL || window.location.origin + import.meta.env.BASE_URL

export default function QR() {
  const tapRef = useRef(0)
  const timerRef = useRef(null)

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
        background: '#090a0a', color: '#f5f5f7',
        fontFamily: 'Pretendard, -apple-system, sans-serif',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 40, userSelect: 'none',
      }}
    >
      {/* 로고 */}
      <div style={{ fontSize: 11, letterSpacing: '0.42em', color: '#7ab6af', fontWeight: 500 }}>
        ASTON MARTIN
      </div>

      {/* QR */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <QRCodeSVG
          value={SURVEY_URL}
          size={220}
          bgColor="#ffffff"
          fgColor="#090a0a"
          level="M"
        />
      </div>

      {/* 안내 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 10, letterSpacing: '-0.01em' }}>
          QR을 스캔하여 설문에 참여해 주세요
        </div>
        <div style={{ fontSize: 13, color: '#525866', lineHeight: 1.7 }}>
          카메라로 QR 코드를 스캔하시면<br />설문 페이지로 이동합니다
        </div>
      </div>

      {/* 전체화면 버튼 */}
      {typeof document !== 'undefined' && !document.fullscreenElement && (
        <div
          onClick={(e) => { e.stopPropagation(); enterFullscreen() }}
          style={{
            position: 'absolute', bottom: 40,
            fontSize: 12, letterSpacing: '0.14em', color: '#525866',
            borderBottom: '1px solid rgba(255,255,255,0.14)',
            paddingBottom: 6, cursor: 'pointer',
          }}
        >
          전체보기
        </div>
      )}
    </div>
  )
}
