import { useState, useRef, useEffect, useCallback } from 'react'

const GOOGLE_SCRIPT_URL = '' // ponytail: Google Apps Script 웹앱 URL, 연동 시 채울 것

const BASE = import.meta.env.BASE_URL

const MODELS = [
  { id: 'vantage-s', name: 'VANTAGE S', sub: 'Front-engine V8 · 665 PS', img: `${BASE}images/vantage.png` },
  { id: 'db12-s', name: 'DB12 S', sub: 'Super Tourer · 700 PS', img: `${BASE}images/db12.png` },
  { id: 'dbx707', name: 'DBX707', sub: 'Luxury SUV · 707 PS', img: `${BASE}images/dbx707.png` },
]

const EMAIL_DOMAINS = ['@naver.com', '@gmail.com', '@daum.net', '@kakao.com']

const TERMS = [
  { id: 'privacy', label: '개인정보 수집 및 이용 동의', required: true },
  { id: 'thirdParty', label: '공식 딜러사 제3자 제공 동의', required: true },
  { id: 'marketing', label: '마케팅 및 프라이빗 이벤트 정보 수신', required: false },
]

const STEPS = ['model', 'name', 'phone', 'birth', 'email', 'consent']
const EXPAND_RATIO = 6

function formatPhone(v) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

function formatBirth(v) {
  const d = v.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 4) return d
  if (d.length <= 6) return `${d.slice(0, 4)}.${d.slice(4)}`
  return `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6)}`
}

// -- Steps --

function StepModel({ value, onChange }) {
  const flexFor = (id) => value === id ? EXPAND_RATIO : value ? 1 : 2
  const onFor = (id) => value === id ? 1 : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <div style={{ padding: '26px 24px 22px' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#525866', marginBottom: 14 }}>MODEL</div>
        <div style={{ fontSize: 23, lineHeight: 1.45, fontWeight: 500, letterSpacing: '-0.01em' }}>
          어떤 모델에<br />가장 관심이 가시나요?
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {MODELS.map((m) => (
          <div
            key={m.id}
            onClick={() => onChange(m.id)}
            style={{
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              transition: 'flex-grow .5s cubic-bezier(.4,0,.2,1)',
              flex: `${flexFor(m.id)} 1 0`,
              minHeight: 58,
            }}
          >
            {/* 차량 이미지 */}
            <img
              src={m.img} alt={m.name}
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'center 60%',
                transition: 'opacity .6s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)',
                opacity: onFor(m.id),
                transform: value === m.id ? 'scale(1.06)' : 'scale(1.12)',
              }}
            />
            {/* 그라데이션 오버레이 */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(9,10,10,0.6) 0%, rgba(9,10,10,0.1) 40%, rgba(9,10,10,0.85) 100%)',
              pointerEvents: 'none',
              transition: 'opacity .5s ease',
              opacity: onFor(m.id),
            }} />
            {/* 모델명 */}
            <div style={{
              position: 'absolute', left: 24, top: 0, height: 58,
              display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'none',
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%', background: '#006c62',
                transition: 'opacity .4s ease', opacity: onFor(m.id),
              }} />
              <div style={{ fontSize: 15, letterSpacing: '0.2em', fontWeight: 400 }}>{m.name}</div>
            </div>
            {/* 서브텍스트 */}
            <div style={{
              position: 'absolute', left: 24, right: 24, bottom: 20,
              pointerEvents: 'none', transition: 'opacity .45s ease', opacity: onFor(m.id),
            }}>
              <div style={{ fontSize: 12, letterSpacing: '0.04em', color: '#7ab6af' }}>{m.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepInput({ tag, label, hint, value, onChange, onEnter, type = 'text', inputMode, placeholder }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])

  return (
    <div style={{ padding: '26px 24px 0', animation: 'amIn .22s ease both' }}>
      <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#525866', marginBottom: 14 }}>{tag}</div>
      <div style={{ fontSize: 23, lineHeight: 1.45, fontWeight: 500, marginBottom: 44 }}>{label}</div>
      <input
        ref={ref}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => { if (e.key === 'Enter' && onEnter) onEnter() }}
        placeholder={placeholder}
        style={{
          width: '100%', background: 'transparent', border: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '0 0 14px', fontFamily: 'inherit',
          fontSize: 22, fontWeight: 400, color: '#f5f5f7',
          letterSpacing: type === 'tel' ? '0.04em' : '0.01em',
          fontVariantNumeric: inputMode === 'numeric' || type === 'tel' ? 'tabular-nums' : undefined,
          transition: 'border-color .25s ease',
        }}
      />
      {hint && (
        <div style={{ marginTop: 16, fontSize: 12, color: '#525866', letterSpacing: '0.01em' }}>{hint}</div>
      )}
    </div>
  )
}

function StepEmail({ value, onChange, onEnter }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])

  const handleQuick = (domain) => {
    const local = value.split('@')[0]
    if (local) onChange({ target: { value: local + domain } })
  }

  const showDomains = !value.includes('@') || value.endsWith('@')

  return (
    <div style={{ padding: '26px 24px 0', animation: 'amIn .22s ease both' }}>
      <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#525866', marginBottom: 14 }}>EMAIL</div>
      <div style={{ fontSize: 23, lineHeight: 1.45, fontWeight: 500, marginBottom: 44 }}>이메일 주소를 입력해 주세요</div>
      <input
        ref={ref}
        type="email"
        inputMode="email"
        autoCapitalize="off"
        autoComplete="off"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => { if (e.key === 'Enter' && onEnter) onEnter() }}
        placeholder="name@example.com"
        style={{
          width: '100%', background: 'transparent', border: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '0 0 14px', fontFamily: 'inherit',
          fontSize: 20, fontWeight: 400, color: '#f5f5f7',
          transition: 'border-color .25s ease',
        }}
      />
      {showDomains && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
          {EMAIL_DOMAINS.map((d) => (
            <div
              key={d}
              onClick={() => handleQuick(d)}
              style={{
                padding: '8px 13px',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 2, fontSize: 12, color: '#7ab6af',
                cursor: 'pointer', transition: 'border-color .2s ease, color .2s ease',
              }}
            >
              {d}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StepConsent({ agreed, onToggle }) {
  const allChecked = TERMS.every((t) => agreed[t.id])

  const toggleAll = () => {
    const next = !allChecked
    const obj = {}
    TERMS.forEach((t) => { obj[t.id] = next })
    onToggle(obj)
  }

  return (
    <div style={{ padding: '26px 24px 0', animation: 'amIn .22s ease both' }}>
      <div style={{ fontSize: 11, letterSpacing: '0.22em', color: '#525866', marginBottom: 14 }}>CONSENT</div>
      <div style={{ fontSize: 23, lineHeight: 1.45, fontWeight: 500, marginBottom: 36 }}>수신 동의를 확인해 주세요</div>

      {/* 전체 동의 토글 */}
      <div
        onClick={toggleAll}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          padding: '18px 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: '0.01em' }}>전체 동의하기</div>
        <div style={{
          position: 'relative', width: 44, height: 24, borderRadius: 12, flexShrink: 0,
          transition: 'background .3s ease',
          background: allChecked ? '#006c62' : '#121416',
        }}>
          <div style={{
            position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%',
            background: '#f5f5f7',
            transition: 'left .3s cubic-bezier(.4,0,.2,1)',
            left: allChecked ? 23 : 3,
          }} />
        </div>
      </div>

      {/* 개별 항목 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 8 }}>
        {TERMS.map((t) => (
          <div
            key={t.id}
            onClick={() => onToggle({ ...agreed, [t.id]: !agreed[t.id] })}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', cursor: 'pointer' }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.14)', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: '#006c62',
                transition: 'opacity .2s ease', opacity: agreed[t.id] ? 1 : 0,
              }} />
            </div>
            <div style={{ fontSize: 13, color: '#525866', letterSpacing: '0.01em' }}>
              {t.required
                ? <><span style={{ color: '#7ab6af' }}>[필수]</span> {t.label}</>
                : `[선택] ${t.label}`
              }
            </div>
          </div>
        ))}
      </div>

      {/* 법적 안내 */}
      <div style={{
        marginTop: 26, padding: '18px 0 30px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontSize: 11, lineHeight: 1.85, color: '#525866',
      }}>
        수집 항목: 성함, 연락처, 생년월일, 이메일 · 보유 기간: 수집일로부터 1년<br />
        동의를 거부하실 수 있으나, 이 경우 상담 안내가 제한됩니다.
      </div>
    </div>
  )
}

function StepDone({ onReset }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 40,
      background: 'rgba(9,10,10,0.92)', backdropFilter: 'blur(6px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '0 34px', textAlign: 'center',
      animation: 'amFade .28s ease both',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '1px solid rgba(122,182,175,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 30,
      }}>
        <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
          <path d="M1 6.5L6.5 12L17 1" stroke="#7ab6af" strokeWidth="1.2" />
        </svg>
      </div>
      <div style={{ fontSize: 10, letterSpacing: '0.42em', color: '#7ab6af', marginBottom: 20 }}>REQUEST RECEIVED</div>
      <div style={{ fontSize: 21, fontWeight: 500, lineHeight: 1.5, marginBottom: 16 }}>신청이 접수되었습니다</div>
      <div style={{ fontSize: 13, lineHeight: 1.9, color: '#525866' }}>
        담당 세일즈 컨설턴트가 영업일 1일 내<br />입력하신 연락처로 안내드립니다.
      </div>
      <div
        onClick={onReset}
        style={{
          marginTop: 44, fontSize: 12, letterSpacing: '0.14em', color: '#525866',
          borderBottom: '1px solid rgba(255,255,255,0.14)', paddingBottom: 6, cursor: 'pointer',
        }}
      >
        처음으로
      </div>
    </div>
  )
}

// -- Main --

export default function App() {
  const [step, setStep] = useState(0)
  const [model, setModel] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [birth, setBirth] = useState('')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState({})
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [kbOffset, setKbOffset] = useState(0)

  // 키보드 감지
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const handler = () => {
      setKbOffset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop))
    }
    vv.addEventListener('resize', handler)
    vv.addEventListener('scroll', handler)
    return () => {
      vv.removeEventListener('resize', handler)
      vv.removeEventListener('scroll', handler)
    }
  }, [])

  const key = STEPS[step]
  const isLast = key === 'consent'
  const progress = `${Math.round(((step + 1) / STEPS.length) * 100)}%`

  const valid = (() => {
    switch (key) {
      case 'model': return !!model
      case 'name': return name.trim().length >= 2
      case 'phone': return phone.replace(/\D/g, '').length === 11
      case 'birth': return birth.replace(/\D/g, '').length === 8
      case 'email': return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim())
      case 'consent': return !!(agreed.privacy && agreed.thirdParty)
      default: return false
    }
  })()

  const go = useCallback((n) => setStep(Math.max(0, Math.min(STEPS.length - 1, n))), [])
  const goNext = () => { if (valid) go(step + 1) }
  const goBack = () => { if (step > 0) go(step - 1) }

  const submit = async () => {
    if (submitting || !valid) return
    setSubmitting(true)

    const payload = {
      model: MODELS.find((m) => m.id === model)?.name,
      name, phone, birth, email,
      privacy: agreed.privacy ? 'Y' : 'N',
      thirdParty: agreed.thirdParty ? 'Y' : 'N',
      marketing: agreed.marketing ? 'Y' : 'N',
      timestamp: new Date().toISOString(),
    }

    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } catch { /* ponytail: fire-and-forget */ }
    }

    setDone(true)
    setSubmitting(false)
  }

  const reset = () => {
    setStep(0); setModel(''); setName(''); setPhone(''); setBirth('')
    setEmail(''); setAgreed({}); setDone(false)
  }

  return (
    <div style={{
      position: 'relative', width: '100%', maxWidth: 480,
      height: '100dvh', margin: '0 auto',
      background: '#090a0a', color: '#f5f5f7',
      fontFamily: 'Pretendard, -apple-system, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Progress bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.08)', zIndex: 20 }}>
        <div style={{ height: 1, background: '#006c62', transition: 'width .4s cubic-bezier(.4,0,.2,1)', width: progress }} />
      </div>

      {/* Header */}
      <div style={{
        position: 'absolute', top: 1, left: 0, right: 0, zIndex: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 24px 0', background: '#090a0a',
      }}>
        <div
          onClick={goBack}
          style={{
            width: 32, height: 32, marginLeft: -8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', opacity: step === 0 ? 0 : 1,
            pointerEvents: step === 0 ? 'none' : 'auto',
          }}
        >
          <svg width="9" height="16" viewBox="0 0 9 16" fill="none">
            <path d="M8 1L1 8l7 7" stroke="#f5f5f7" strokeWidth="1.1" />
          </svg>
        </div>
        <div style={{ fontSize: 10, letterSpacing: '0.42em', color: '#7ab6af', fontWeight: 500 }}>ASTON MARTIN</div>
        <div style={{ width: 32, textAlign: 'right', fontSize: 10, letterSpacing: '0.08em', color: '#525866', fontVariantNumeric: 'tabular-nums' }}>
          {step + 1}/{STEPS.length}
        </div>
      </div>

      {/* Content area */}
      {key === 'model' && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 74, bottom: 104, display: 'flex', flexDirection: 'column', animation: 'amIn .22s ease both' }}>
          <StepModel value={model} onChange={setModel} />
        </div>
      )}

      {key === 'name' && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 74 }}>
          <StepInput
            tag="NAME"
            label="성함을 알려주세요"
            hint="상담 시 안내드릴 성함입니다."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onEnter={goNext}
            placeholder="홍길동"
          />
        </div>
      )}

      {key === 'phone' && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 74 }}>
          <StepInput
            tag="CONTACT"
            label="연락처를 입력해 주세요"
            hint="설문 결과 안내를 위해 사용됩니다."
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            onEnter={goNext}
            type="tel"
            inputMode="numeric"
            placeholder="010-0000-0000"
          />
        </div>
      )}

      {key === 'birth' && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 74 }}>
          <StepInput
            tag="DATE OF BIRTH"
            label="생년월일을 입력해 주세요"
            hint="8자리 숫자로 입력해 주세요. 예) 19900512"
            value={birth}
            onChange={(e) => setBirth(formatBirth(e.target.value))}
            onEnter={goNext}
            inputMode="numeric"
            placeholder="YYYYMMDD"
          />
        </div>
      )}

      {key === 'email' && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 74 }}>
          <StepEmail
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onEnter={goNext}
          />
        </div>
      )}

      {key === 'consent' && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 74, bottom: 104, overflowY: 'auto' }}>
          <StepConsent agreed={agreed} onToggle={setAgreed} />
        </div>
      )}

      {/* Bottom bar */}
      {!done && (
        <div style={{
          position: 'absolute', left: 0, right: 0,
          padding: '0 24px 22px',
          background: 'linear-gradient(180deg, rgba(9,10,10,0) 0%, #090a0a 34%)',
          zIndex: 15,
          transition: 'bottom .18s ease',
          bottom: kbOffset,
        }}>
          {!isLast && valid && (
            <div
              onClick={goNext}
              style={{
                height: 56, borderRadius: 2, background: '#006c62',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 500, letterSpacing: '0.02em', color: '#f5f5f7',
                cursor: 'pointer', animation: 'amFade .2s ease both',
              }}
            >
              다음
            </div>
          )}
          {!isLast && !valid && (
            <div style={{
              height: 56, borderRadius: 2, background: '#121416',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 500, letterSpacing: '0.02em', color: '#525866',
            }}>
              다음
            </div>
          )}
          {isLast && valid && (
            <div
              onClick={submit}
              style={{
                height: 56, borderRadius: 2, background: '#006c62',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 500, letterSpacing: '0.04em', color: '#f5f5f7',
                cursor: 'pointer', animation: 'amFade .2s ease both',
              }}
            >
              상담 신청하기
            </div>
          )}
          {isLast && !valid && (
            <div style={{
              height: 56, borderRadius: 2, background: '#121416',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 500, letterSpacing: '0.04em', color: '#525866',
            }}>
              상담 신청하기
            </div>
          )}
        </div>
      )}

      {/* Done overlay */}
      {done && <StepDone onReset={reset} />}
    </div>
  )
}
