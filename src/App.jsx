import { useState, useRef, useEffect } from 'react'

const GOOGLE_SCRIPT_URL = '' // ponytail: Apps Script 웹앱 URL

const MODELS = [
  { id: 'vantage-s', name: 'Vantage S' },
  { id: 'db12-s', name: 'DB12 S' },
  { id: 'dbx707', name: 'DBX707' },
]

const EMAIL_DOMAINS = ['@naver.com', '@gmail.com', '@kakao.com']

const TERMS = [
  { id: 'privacy', label: '개인정보 수집 및 이용 동의', required: true },
  { id: 'marketing', label: '마케팅 정보 수신 동의 (SMS, 이메일)', required: false },
]

function fmt(v) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

/* ── Shared ── */

function Check({ on, size = 20 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
      style={{
        width: size, height: size,
        background: on ? 'var(--accent)' : 'transparent',
        border: on ? 'none' : '1.5px solid var(--text-dim)',
      }}
    >
      {on && (
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.2L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}

function NextBtn({ enabled, onClick, label = '다음' }) {
  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={onClick}
      className="w-full py-[17px] rounded-2xl text-[15px] font-semibold transition-all duration-200 mt-auto"
      style={{
        background: enabled ? 'var(--accent)' : 'var(--surface)',
        color: enabled ? '#fff' : 'var(--text-dim)',
      }}
    >
      {label}
    </button>
  )
}

/* ── Steps ── */

function ModelStep({ value, onChange, onNext }) {
  return (
    <div className="step-enter flex flex-col h-full">
      <h1 className="text-[24px] font-semibold tracking-[-0.5px] leading-snug" style={{ color: 'var(--text)' }}>
        어떤 모델에<br />관심이 있으신가요?
      </h1>
      <p className="text-[14px] mt-2 mb-8" style={{ color: 'var(--text-sub)' }}>
        관심 있는 모델을 선택해 주세요.
      </p>

      {/* Flex Split Screen — 세로 면 분할 */}
      <div className="flex flex-col gap-[1px] rounded-2xl overflow-hidden mb-10" style={{ background: 'var(--border)', minHeight: 380 }}>
        {MODELS.map((m) => {
          const on = value === m.id
          const hasSelection = !!value
          // 선택된 카드: flex 4, 미선택: flex 1, 아무것도 선택 안 됨: 균등
          const flexVal = !hasSelection ? 1 : on ? 4 : 0.6
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              className="relative w-full overflow-hidden transition-all duration-500 ease-out"
              style={{
                flex: flexVal,
                background: on ? 'var(--accent-soft)' : 'var(--surface)',
              }}
            >
              {/* 확장 시 이미지 영역 — ponytail: placeholder, 실제 차량 이미지로 교체 */}
              {on && (
                <div
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
                  style={{ opacity: 0.15 }}
                >
                  <span className="text-[48px] font-extralight tracking-[8px] uppercase" style={{ color: 'var(--accent)' }}>
                    {m.name.charAt(0)}
                  </span>
                </div>
              )}

              <div className="relative z-10 h-full flex items-center px-6">
                <span
                  className="transition-all duration-500"
                  style={{
                    fontSize: on ? 18 : 14,
                    fontWeight: on ? 600 : 400,
                    letterSpacing: on ? '-0.3px' : '0.5px',
                    color: on ? 'var(--accent)' : hasSelection ? 'var(--text-dim)' : 'var(--text)',
                  }}
                >
                  {m.name}
                </span>

                {on && (
                  <div className="ml-auto">
                    <Check on size={20} />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <NextBtn enabled={!!value} onClick={onNext} />
    </div>
  )
}

function InputStep({ label, desc, value, onChange, onNext, type = 'text', inputMode, placeholder, valid }) {
  const ref = useRef(null)
  useEffect(() => { setTimeout(() => ref.current?.focus(), 120) }, [])

  const handleKey = (e) => { if (e.key === 'Enter' && valid) onNext() }

  return (
    <div className="step-enter flex flex-col h-full">
      <h1 className="text-[24px] font-semibold tracking-[-0.5px] leading-snug" style={{ color: 'var(--text)' }}>
        {label}
      </h1>
      {desc && <p className="text-[14px] mt-2" style={{ color: 'var(--text-sub)' }}>{desc}</p>}

      <div className="mt-10">
        <input
          ref={ref}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={onChange}
          onKeyDown={handleKey}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full text-[22px] font-light pb-3 bg-transparent transition-all duration-200"
          style={{ borderBottom: '1.5px solid var(--border)', color: 'var(--text)', caretColor: 'var(--accent)' }}
          onFocus={(e) => e.target.style.borderBottomColor = 'var(--accent)'}
          onBlur={(e) => e.target.style.borderBottomColor = 'var(--border)'}
        />
      </div>

      <div className="mt-8">
        <NextBtn enabled={valid} onClick={onNext} />
      </div>
    </div>
  )
}

function EmailStep({ value, onChange, onNext, valid }) {
  const ref = useRef(null)
  useEffect(() => { setTimeout(() => ref.current?.focus(), 120) }, [])

  const pick = (domain) => {
    const local = value.split('@')[0]
    if (local) onChange({ target: { value: local + domain } })
  }

  const handleKey = (e) => { if (e.key === 'Enter' && valid) onNext() }

  return (
    <div className="step-enter flex flex-col h-full">
      <h1 className="text-[24px] font-semibold tracking-[-0.5px] leading-snug" style={{ color: 'var(--text)' }}>
        이메일 주소를<br />입력해 주세요
      </h1>
      <p className="text-[14px] mt-2" style={{ color: 'var(--text-sub)' }}>안내를 받으실 이메일입니다.</p>

      <div className="mt-10">
        <input
          ref={ref}
          type="email"
          value={value}
          onChange={onChange}
          onKeyDown={handleKey}
          placeholder="example@email.com"
          autoComplete="off"
          className="w-full text-[22px] font-light pb-3 bg-transparent transition-all duration-200"
          style={{ borderBottom: '1.5px solid var(--border)', color: 'var(--text)', caretColor: 'var(--accent)' }}
          onFocus={(e) => e.target.style.borderBottomColor = 'var(--accent)'}
          onBlur={(e) => e.target.style.borderBottomColor = 'var(--border)'}
        />
        <div className="flex gap-2 mt-4">
          {EMAIL_DOMAINS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => pick(d)}
              className="text-[12px] px-3 py-1.5 rounded-full transition-all duration-150"
              style={{ background: 'var(--surface)', color: 'var(--text-sub)' }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <NextBtn enabled={valid} onClick={onNext} />
      </div>
    </div>
  )
}

function TermsStep({ agreed, onToggle, onSubmit, submitting }) {
  const allChecked = TERMS.every((t) => agreed[t.id])
  const requiredOk = TERMS.filter((t) => t.required).every((t) => agreed[t.id])

  const toggleAll = () => {
    const next = !allChecked
    const obj = {}
    TERMS.forEach((t) => { obj[t.id] = next })
    onToggle(obj)
  }

  return (
    <div className="step-enter flex flex-col h-full">
      <h1 className="text-[24px] font-semibold tracking-[-0.5px] leading-snug" style={{ color: 'var(--text)' }}>
        약관에 동의해 주세요
      </h1>
      <p className="text-[14px] mt-2 mb-10" style={{ color: 'var(--text-sub)' }}>
        원활한 안내를 위해 동의가 필요합니다.
      </p>

      <button
        type="button"
        onClick={toggleAll}
        className="w-full flex items-center gap-4 py-5 px-5 rounded-2xl mb-4 transition-all duration-200"
        style={{
          background: allChecked ? 'var(--accent-soft)' : 'var(--surface)',
          border: allChecked ? '1.5px solid var(--accent-border)' : '1.5px solid transparent',
        }}
      >
        <Check on={allChecked} size={22} />
        <span className="text-[15px] font-semibold" style={{ color: 'var(--text)' }}>전체 동의하기</span>
      </button>

      <div className="pl-3 space-y-1 mb-10">
        {TERMS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onToggle({ ...agreed, [t.id]: !agreed[t.id] })}
            className="w-full flex items-center gap-3 py-3 px-2 text-left"
          >
            <Check on={agreed[t.id]} size={18} />
            <span className="text-[13px]" style={{ color: 'var(--text-sub)' }}>
              <span style={{ color: t.required ? 'var(--accent)' : 'var(--text-dim)' }}>
                {t.required ? '[필수]' : '[선택]'}
              </span>{' '}{t.label}
            </span>
          </button>
        ))}
      </div>

      <NextBtn enabled={requiredOk && !submitting} onClick={onSubmit} label={submitting ? '제출 중...' : '설문 제출하기'} />
    </div>
  )
}

function DoneStep() {
  return (
    <div className="step-enter flex flex-col items-center justify-center text-center h-full">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-8" style={{ background: 'var(--accent-soft)' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="text-[24px] font-semibold tracking-[-0.5px] mb-3" style={{ color: 'var(--text)' }}>
        설문이 완료되었습니다
      </h1>
      <p className="text-[15px] leading-relaxed" style={{ color: 'var(--text-sub)' }}>
        소중한 시간 내어 주셔서 감사합니다.
      </p>
    </div>
  )
}

/* ── App ── */

export default function App() {
  const [step, setStep] = useState(0)
  const [model, setModel] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [birth, setBirth] = useState('')
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [visible, setVisible] = useState(true)
  const [key, setKey] = useState(0)

  const go = (dir) => {
    setVisible(false)
    setTimeout(() => { setStep((s) => s + dir); setKey((k) => k + 1); setVisible(true) }, 150)
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const submit = async () => {
    if (submitting) return
    setSubmitting(true)
    const payload = {
      model: MODELS.find((m) => m.id === model)?.name,
      name, phone, birth, email,
      privacy: agreed.privacy ? 'Y' : 'N',
      marketing: agreed.marketing ? 'Y' : 'N',
      timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    }
    if (GOOGLE_SCRIPT_URL) {
      try { await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }) } catch {}
    }
    go(1)
    setSubmitting(false)
  }

  const isDone = step === 6
  const progress = (step + 1) / 7

  return (
    <div className="min-h-dvh flex flex-col max-w-[480px] mx-auto" style={{ background: 'var(--bg)' }}>

      {/* ── Header ── */}
      {!isDone && (
        <header className="sticky top-0 z-50 shrink-0" style={{ background: 'var(--bg)' }}>
          <div className="w-full" style={{ height: 2, background: 'var(--border)' }}>
            <div className="h-full transition-all duration-700 ease-out" style={{ width: `${progress * 100}%`, background: 'var(--accent)' }} />
          </div>
          <div className="flex items-center justify-between px-5 h-14">
            {step > 0 ? (
              <button type="button" onClick={() => go(-1)} className="p-1 -ml-1">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M14 5L8 11L14 17" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : <div className="w-6" />}
            {/* ponytail: placeholder 텍스트 로고 */}
            <span className="text-[10px] font-medium tracking-[3px] uppercase" style={{ color: 'var(--text-dim)' }}>
              Aston Martin
            </span>
            <div className="w-6" />
          </div>
        </header>
      )}

      {/* ── Content ── */}
      <main
        key={key}
        className="flex-1 flex flex-col px-6 pt-8 pb-12 transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {step === 0 && <ModelStep value={model} onChange={setModel} onNext={() => go(1)} />}
        {step === 1 && <InputStep label="성함을 입력해 주세요" value={name} onChange={(e) => setName(e.target.value)} onNext={() => go(1)} placeholder="홍길동" valid={name.trim().length >= 2} />}
        {step === 2 && <InputStep label="연락처를 입력해 주세요" desc="안내받으실 번호를 입력해 주세요." value={phone} onChange={(e) => setPhone(fmt(e.target.value))} onNext={() => go(1)} type="tel" inputMode="tel" placeholder="010-0000-0000" valid={phone.replace(/\D/g, '').length === 11} />}
        {step === 3 && <InputStep label="생년월일 8자리를 입력해 주세요" value={birth} onChange={(e) => setBirth(e.target.value.replace(/\D/g, '').slice(0, 8))} onNext={() => go(1)} inputMode="numeric" placeholder="19900101" valid={birth.length === 8} />}
        {step === 4 && <EmailStep value={email} onChange={(e) => setEmail(e.target.value)} onNext={() => go(1)} valid={validEmail} />}
        {step === 5 && <TermsStep agreed={agreed} onToggle={setAgreed} onSubmit={submit} submitting={submitting} />}
        {step === 6 && <DoneStep />}
      </main>
    </div>
  )
}
