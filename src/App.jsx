import { useState, useRef, useEffect } from 'react'

const GOOGLE_SCRIPT_URL = '' // ponytail: Google Apps Script 웹앱 URL, 연동 시 채울 것

const MODELS = [
  { id: 'vantage-s', name: 'Vantage S', img: null },
  { id: 'db12-s', name: 'DB12 S', img: null },
  { id: 'dbx707', name: 'DBX707', img: null },
]

const EMAIL_DOMAINS = ['@naver.com', '@gmail.com', '@kakao.com']

const TERMS = [
  { id: 'privacy', label: '개인정보 수집 및 이용 동의', required: true },
  { id: 'marketing', label: '마케팅 정보 수신 동의', required: false },
]

function formatPhone(v) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

function formatBirth(v) {
  return v.replace(/\D/g, '').slice(0, 8)
}

// -- Steps --

function StepModel({ value, onChange }) {
  return (
    <div>
      <h2 className="text-[22px] font-light tracking-tight mb-2">
        어떤 모델에 가장 관심이 가시나요?
      </h2>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
        관심 차종을 선택해 주세요
      </p>
      <div className="grid grid-cols-1 gap-3">
        {MODELS.map((m) => {
          const selected = value === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              className="relative rounded-lg overflow-hidden transition-colors duration-200"
              style={{
                background: selected ? 'rgba(0,108,98,0.15)' : 'var(--color-surface)',
                border: selected
                  ? '1px solid rgba(0,108,98,0.4)'
                  : '1px solid var(--color-border)',
              }}
            >
              {/* placeholder 이미지 영역 */}
              <div
                className="w-full flex items-center justify-center"
                style={{
                  height: 160,
                  background: selected
                    ? 'rgba(0,108,98,0.08)'
                    : 'rgba(255,255,255,0.02)',
                }}
              >
                {m.img ? (
                  <img src={m.img} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {m.name}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span
                  className="text-[15px] font-medium"
                  style={{ color: selected ? 'var(--color-primary)' : 'var(--color-text-main)' }}
                >
                  {m.name}
                </span>
                {selected && (
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="9" fill="var(--color-primary)" />
                    <path d="M5.5 9.2L7.8 11.5L12.5 6.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function StepInput({ label, sub, value, onChange, type = 'text', placeholder, inputMode }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])

  return (
    <div>
      <h2 className="text-[22px] font-light tracking-tight mb-2">{label}</h2>
      {sub && (
        <p className="text-sm mb-10" style={{ color: 'var(--color-text-muted)' }}>{sub}</p>
      )}
      <input
        ref={ref}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-[20px] font-light pb-3 bg-transparent transition-colors duration-200"
        style={{ borderBottom: '1px solid var(--color-border)', caretColor: 'var(--color-primary)' }}
      />
    </div>
  )
}

function StepEmail({ value, onChange }) {
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])

  const handleQuick = (domain) => {
    const local = value.split('@')[0]
    if (local) onChange({ target: { value: local + domain } })
  }

  return (
    <div>
      <h2 className="text-[22px] font-light tracking-tight mb-2">이메일 주소를 입력해 주세요</h2>
      <p className="text-sm mb-10" style={{ color: 'var(--color-text-muted)' }}>
        시승 안내를 받으실 이메일입니다
      </p>
      <input
        ref={ref}
        type="email"
        value={value}
        onChange={onChange}
        placeholder="example@email.com"
        className="w-full text-[20px] font-light pb-3 bg-transparent transition-colors duration-200"
        style={{ borderBottom: '1px solid var(--color-border)', caretColor: 'var(--color-primary)' }}
      />
      <div className="flex gap-2 mt-4 flex-wrap">
        {EMAIL_DOMAINS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => handleQuick(d)}
            className="text-xs px-3 py-1.5 rounded-full transition-colors duration-200"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  )
}

function StepTerms({ agreed, onToggle }) {
  const allRequired = TERMS.filter((t) => t.required).every((t) => agreed[t.id])
  const allChecked = TERMS.every((t) => agreed[t.id])

  const toggleAll = () => {
    const next = !allChecked
    const obj = {}
    TERMS.forEach((t) => { obj[t.id] = next })
    onToggle(obj)
  }

  return (
    <div>
      <h2 className="text-[22px] font-light tracking-tight mb-2">수신 동의를 확인해 주세요</h2>
      <p className="text-sm mb-10" style={{ color: 'var(--color-text-muted)' }}>
        원활한 안내를 위해 동의가 필요합니다
      </p>

      {/* 전체 동의 */}
      <button
        type="button"
        onClick={toggleAll}
        className="w-full flex items-center gap-3 py-4 px-4 rounded-lg mb-3 transition-colors duration-200"
        style={{
          background: allChecked ? 'rgba(0,108,98,0.1)' : 'var(--color-surface)',
          border: allChecked ? '1px solid rgba(0,108,98,0.3)' : '1px solid var(--color-border)',
        }}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200"
          style={{
            background: allChecked ? 'var(--color-primary)' : 'transparent',
            border: allChecked ? 'none' : '1.5px solid var(--color-text-muted)',
          }}
        >
          {allChecked && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6.2L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span className="text-[15px] font-medium">전체 동의하기</span>
      </button>

      <div className="space-y-1">
        {TERMS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onToggle({ ...agreed, [t.id]: !agreed[t.id] })}
            className="w-full flex items-center gap-3 py-3 px-4"
          >
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200"
              style={{
                background: agreed[t.id] ? 'var(--color-primary)' : 'transparent',
                border: agreed[t.id] ? 'none' : '1.5px solid var(--color-text-muted)',
              }}
            >
              {agreed[t.id] && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6.2L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
              {t.required ? '[필수] ' : '[선택] '}{t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepDone() {
  return (
    <div className="flex flex-col items-center justify-center pt-20 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'rgba(0,108,98,0.15)' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-[22px] font-light tracking-tight mb-3">설문이 완료되었습니다</h2>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        소중한 시간 내어 주셔서 감사합니다
      </p>
    </div>
  )
}

// -- Main --

const TOTAL_STEPS = 7 // model, name, phone, birth, email, terms, done

export default function App() {
  const [step, setStep] = useState(0)
  const [model, setModel] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [birth, setBirth] = useState('')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [fade, setFade] = useState(true)

  const goNext = () => {
    setFade(false)
    setTimeout(() => { setStep((s) => s + 1); setFade(true) }, 150)
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const requiredAgreed = TERMS.filter((t) => t.required).every((t) => agreed[t.id])

  const canNext = [
    !!model,
    name.trim().length >= 2,
    phone.replace(/\D/g, '').length === 11,
    birth.length === 8,
    validEmail,
    requiredAgreed,
  ]

  const submit = async () => {
    if (submitting) return
    setSubmitting(true)

    const payload = {
      model: MODELS.find((m) => m.id === model)?.name,
      name, phone, birth, email,
      privacy: agreed.privacy ? 'Y' : 'N',
      marketing: agreed.marketing ? 'Y' : 'N',
      timestamp: new Date().toISOString(),
    }

    if (GOOGLE_SCRIPT_URL) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } catch { /* ponytail: no-cors POST fire-and-forget, 실패해도 완료 화면 보여줌 */ }
    }

    goNext()
    setSubmitting(false)
  }

  const isDone = step === TOTAL_STEPS - 1
  const isTerms = step === TOTAL_STEPS - 2
  const progress = step / (TOTAL_STEPS - 1)

  return (
    <div className="min-h-dvh flex flex-col relative" style={{ background: 'var(--color-bg)' }}>
      {/* Progress bar */}
      {!isDone && (
        <div className="fixed top-0 left-0 right-0 z-50" style={{ height: 2, background: 'var(--color-border)' }}>
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{ width: `${progress * 100}%`, background: 'var(--color-primary)' }}
          />
        </div>
      )}

      {/* Logo */}
      {!isDone && (
        <div className="pt-14 pb-4 px-6 flex items-center justify-center">
          {/* ponytail: placeholder 로고, 실제 로고 이미지로 교체할 것 */}
          <span className="text-[11px] tracking-[3px] uppercase" style={{ color: 'var(--color-text-muted)' }}>
            Aston Martin Suwon
          </span>
        </div>
      )}

      {/* Back */}
      {step > 0 && !isDone && (
        <button
          type="button"
          onClick={() => { setFade(false); setTimeout(() => { setStep((s) => s - 1); setFade(true) }, 150) }}
          className="absolute top-12 left-5 z-40 p-2"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 4L7 10L13 16" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Content */}
      <div
        className="flex-1 px-6 pt-6 pb-32 transition-opacity duration-200"
        style={{ opacity: fade ? 1 : 0 }}
      >
        {step === 0 && <StepModel value={model} onChange={setModel} />}
        {step === 1 && (
          <StepInput
            label="성함을 입력해 주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
          />
        )}
        {step === 2 && (
          <StepInput
            label="안내받으실 연락처를 입력해 주세요"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            type="tel"
            inputMode="tel"
            placeholder="010-0000-0000"
          />
        )}
        {step === 3 && (
          <StepInput
            label="생년월일 8자리를 입력해 주세요"
            sub="YYYYMMDD"
            value={birth}
            onChange={(e) => setBirth(formatBirth(e.target.value))}
            inputMode="numeric"
            placeholder="19900101"
          />
        )}
        {step === 4 && (
          <StepEmail value={email} onChange={(e) => setEmail(e.target.value)} />
        )}
        {step === 5 && <StepTerms agreed={agreed} onToggle={setAgreed} />}
        {step === 6 && <StepDone />}
      </div>

      {/* Bottom button */}
      {!isDone && (
        <div className="fixed bottom-0 left-0 right-0 p-5 z-40" style={{ background: 'linear-gradient(transparent, var(--color-bg) 30%)' }}>
          <button
            type="button"
            disabled={!canNext[step]}
            onClick={isTerms ? submit : goNext}
            className="w-full py-4 rounded-lg text-[15px] font-medium transition-all duration-200"
            style={{
              background: canNext[step] ? 'var(--color-primary)' : 'var(--color-surface)',
              color: canNext[step] ? '#fff' : 'var(--color-text-muted)',
              border: canNext[step] ? 'none' : '1px solid var(--color-border)',
            }}
          >
            {isTerms ? '설문 제출하기' : '다음'}
          </button>
        </div>
      )}
    </div>
  )
}
