import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  PawPrint,
} from 'lucide-react'

const INITIAL_DATA = {
  fullName: '',
  address: '',
  birthDate: '',
  phone: '',
  email: '',
  pets: '',
  branch: '',
  consentTerms: false,
  consentGdpr: false,
}

export default function Registration({ logoSrc, stores }) {
  const [data, setData] = useState(INITIAL_DATA)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  const setField = (name, value) => {
    setData((d) => ({ ...d, [name]: value }))
    setErrors((e) => {
      if (!e[name]) return e
      const next = { ...e }
      delete next[name]
      return next
    })
  }

  const validate = () => {
    const e = {}
    if (!data.fullName.trim()) e.fullName = 'Vyplňte jméno a příjmení'
    if (!data.address.trim()) e.address = 'Vyplňte adresu'
    if (!data.birthDate) e.birthDate = 'Vyplňte datum narození'
    if (!data.phone.trim()) e.phone = 'Vyplňte telefonní číslo'
    else if (!/^[+\d\s()-]{9,}$/.test(data.phone.trim()))
      e.phone = 'Telefon vypadá nesprávně'
    if (!data.email.trim()) e.email = 'Vyplňte e-mail'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      e.email = 'E-mail vypadá nesprávně'
    if (!data.branch) e.branch = 'Vyberte pobočku'
    if (!data.consentTerms) e.consentTerms = 'Musíte souhlasit s podmínkami'
    if (!data.consentGdpr) e.consentGdpr = 'Musíte souhlasit se zpracováním údajů'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goBack = (e) => {
    e?.preventDefault?.()
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.hash = ''
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/registrace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || `Server vrátil ${res.status}`)
      }
      setStatus('success')
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'Něco se pokazilo. Zkuste to prosím znovu.')
    }
  }

  if (status === 'success') {
    return (
      <div className="reg-page">
        <header className="reg-header">
          <a className="reg-logo" href="#" onClick={goBack}>
            <img src={logoSrc} alt="Ráj mazlíčků" />
          </a>
        </header>
        <main className="reg-success">
          <div className="reg-success-card">
            <div className="reg-success-icon">
              <CheckCircle2 size={56} strokeWidth={1.8} />
            </div>
            <h1>Registrace byla úspěšně přijata!</h1>
            <p>
              Děkujeme, že vstupujete do <strong>Smečky Ráje mazlíčků</strong>.
              Vaši registraci jsme odeslali na pobočku, kterou jste si vybrali.
            </p>
            <p className="reg-success-note">
              Svou věrnostní <strong>kartičku si můžete kdykoliv vyzvednout
              na zvolené prodejně</strong> – stačí se prokázat jménem nebo
              e-mailem, na který jste se registrovali.
            </p>
            <a className="btn btn-primary btn-uppercase" href="#" onClick={goBack}>
              <ArrowLeft size={18} /> Zpět na web
            </a>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="reg-page">
      <header className="reg-header">
        <a className="reg-logo" href="#" onClick={goBack}>
          <img src={logoSrc} alt="Ráj mazlíčků" />
        </a>
        <a className="reg-back" href="#" onClick={goBack}>
          <ArrowLeft size={18} />
          <span>Zpět na web</span>
        </a>
      </header>

      <main className="reg-main">
        <div className="reg-hero">
          <span className="reg-eyebrow">
            <PawPrint size={14} /> Smečka Ráje mazlíčků
          </span>
          <h1 className="reg-title">Registrační formulář</h1>
          <p className="reg-lead">
            Vyplňte prosím své údaje. Po odeslání zasíláme registraci přímo
            na zvolenou pobočku, kde si vyzvednete svou věrnostní kartičku.
          </p>
        </div>

        <form className="reg-form" onSubmit={onSubmit} noValidate>
          <Field
            label="Jméno a příjmení"
            required
            error={errors.fullName}
          >
            <input
              type="text"
              autoComplete="name"
              value={data.fullName}
              onChange={(e) => setField('fullName', e.target.value)}
              placeholder="Jan Novák"
            />
          </Field>

          <Field
            label="Kompletní adresa"
            required
            error={errors.address}
            full
          >
            <input
              type="text"
              autoComplete="street-address"
              value={data.address}
              onChange={(e) => setField('address', e.target.value)}
              placeholder="Ulice 123, 357 35 Chodov"
            />
          </Field>

          <Field
            label="Datum narození"
            required
            error={errors.birthDate}
          >
            <input
              type="date"
              autoComplete="bday"
              value={data.birthDate}
              onChange={(e) => setField('birthDate', e.target.value)}
            />
          </Field>

          <Field
            label="Telefonní číslo"
            required
            error={errors.phone}
          >
            <input
              type="tel"
              autoComplete="tel"
              value={data.phone}
              onChange={(e) => setField('phone', e.target.value)}
              placeholder="+420 777 888 999"
            />
          </Field>

          <Field
            label="E-mail"
            required
            error={errors.email}
            full
          >
            <input
              type="email"
              autoComplete="email"
              value={data.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="vy@email.cz"
            />
          </Field>

          <Field
            label="Vaši mazlíčci"
            hint="Např. jméno, druh, narozeniny, alergie – vše, co je dobré, abychom věděli"
            full
          >
            <textarea
              rows={4}
              value={data.pets}
              onChange={(e) => setField('pets', e.target.value)}
              placeholder="Bára – kočka domácí, 3 roky, alergie na kuřecí…"
            />
          </Field>

          <Field
            label="Pobočka pro vyzvednutí členské karty"
            required
            error={errors.branch}
            full
          >
            <div className="reg-branches">
              {stores.map((s) => (
                <label
                  key={s.id}
                  className={`reg-branch${
                    data.branch === s.id ? ' is-active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="branch"
                    value={s.id}
                    checked={data.branch === s.id}
                    onChange={() => setField('branch', s.id)}
                  />
                  <span className="reg-branch-name">{s.name}</span>
                  <span className="reg-branch-meta">{s.sub}</span>
                </label>
              ))}
            </div>
          </Field>

          <div className="reg-consents">
            <Consent
              checked={data.consentTerms}
              onChange={(v) => setField('consentTerms', v)}
              error={errors.consentTerms}
            >
              Souhlasím se <a href="#">všeobecnými obchodními podmínkami</a> a
              podmínkami členství ve věrnostním programu{' '}
              <strong>Smečka Ráje mazlíčků</strong>.
            </Consent>
            <Consent
              checked={data.consentGdpr}
              onChange={(v) => setField('consentGdpr', v)}
              error={errors.consentGdpr}
            >
              Souhlasím se <a href="#">zpracováním osobních údajů</a> pro účely
              věrnostního programu.
            </Consent>
          </div>

          {status === 'error' && (
            <div className="reg-error" role="alert">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-uppercase reg-submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? (
              <>
                <Loader2 className="reg-spin" size={18} /> Odesílám…
              </>
            ) : (
              'Odeslat registraci'
            )}
          </button>
          <p className="reg-required-note">* povinné údaje</p>
        </form>
      </main>
    </div>
  )
}

function Field({ label, required, error, hint, full, children }) {
  return (
    <label className={`reg-field${full ? ' is-full' : ''}${error ? ' has-error' : ''}`}>
      <span className="reg-label">
        {label}
        {required && <span className="reg-req"> *</span>}
      </span>
      {children}
      {hint && !error && <span className="reg-hint">{hint}</span>}
      {error && <span className="reg-error-text">{error}</span>}
    </label>
  )
}

function Consent({ checked, onChange, error, children }) {
  return (
    <label className={`reg-consent${error ? ' has-error' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="reg-consent-box" aria-hidden="true" />
      <span className="reg-consent-text">{children}</span>
    </label>
  )
}
