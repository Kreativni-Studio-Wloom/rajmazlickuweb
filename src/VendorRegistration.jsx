import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Store,
  Upload,
} from 'lucide-react'

const SORTIMENT_OPTIONS = [
  { id: 'ryby', label: 'Ryby' },
  { id: 'krevety-snek', label: 'Krevety a šneci' },
  { id: 'terarijni-zvirata', label: 'Terarijní zvířata' },
  { id: 'akvaria-teraria', label: 'Akvária a terária' },
  { id: 'akvaristicke', label: 'Akvaristické potřeby' },
  { id: 'teraristicke', label: 'Teraristické potřeby' },
  { id: 'krmiva', label: 'Krmiva' },
  { id: 'rostliny', label: 'Rostliny' },
  { id: 'ptactvo', label: 'Ptactvo' },
  { id: 'keramika', label: 'Keramika' },
  { id: 'hlodavci', label: 'Hlodavci' },
  { id: 'zahradnicke', label: 'Zahradnické potřeby a dekorace' },
  { id: 'obcerstveni', label: 'Občerstvení' },
  { id: 'jine', label: 'Jiné (upřesněte do poznámky)' },
]

const INITIAL = {
  city: '',
  fullName: '',
  ico: '',
  phone: '',
  email: '',
  sortiment: [],
  prepareDayBefore: '',
  tablesCount: '',
  note: '',
  consentRules: false,
  consentAnimals: false,
  cancelPassword: '',
  photo: null,
  photoName: '',
  photoSize: 0,
}

const MAX_PHOTO_BYTES = 6 * 1024 * 1024 // 6 MB

export default function VendorRegistration({ logoSrc }) {
  const [data, setData] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const setField = (name, value) => {
    setData((d) => ({ ...d, [name]: value }))
    setErrors((e) => {
      if (!e[name]) return e
      const n = { ...e }
      delete n[name]
      return n
    })
  }

  const toggleSortiment = (id) => {
    setData((d) => {
      const has = d.sortiment.includes(id)
      return {
        ...d,
        sortiment: has
          ? d.sortiment.filter((x) => x !== id)
          : [...d.sortiment, id],
      }
    })
    setErrors((e) => {
      if (!e.sortiment) return e
      const n = { ...e }
      delete n.sortiment
      return n
    })
  }

  const onPhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      setField('photo', null)
      setField('photoName', '')
      setField('photoSize', 0)
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setErrors((er) => ({ ...er, photo: 'Soubor je větší než 6 MB' }))
      return
    }
    const base64 = await fileToBase64(file)
    setData((d) => ({
      ...d,
      photo: { name: file.name, type: file.type, content: base64 },
      photoName: file.name,
      photoSize: file.size,
    }))
    setErrors((er) => {
      if (!er.photo) return er
      const n = { ...er }
      delete n.photo
      return n
    })
  }

  const validate = () => {
    const e = {}
    if (!data.city) e.city = 'Vyberte město konání'
    if (!data.fullName.trim()) e.fullName = 'Vyplňte jméno a příjmení'
    if (!data.phone.trim()) e.phone = 'Vyplňte telefon'
    else if (!/^\+?\d{9,15}$/.test(data.phone.replace(/\s/g, '')))
      e.phone = 'Telefon vypadá nesprávně (bez mezer)'
    if (!data.email.trim()) e.email = 'Vyplňte e-mail'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      e.email = 'E-mail vypadá nesprávně'
    if (data.sortiment.length === 0)
      e.sortiment = 'Vyberte alespoň jednu položku sortimentu'
    if (!data.tablesCount || Number(data.tablesCount) < 1)
      e.tablesCount = 'Uveďte počet stolů'
    if (!data.prepareDayBefore)
      e.prepareDayBefore = 'Vyberte ano / ne'
    if (!data.consentRules) e.consentRules = 'Souhlas je povinný'
    if (!data.consentAnimals) e.consentAnimals = 'Souhlas je povinný'
    if (!data.cancelPassword.trim())
      e.cancelPassword = 'Zadejte heslo pro případné zrušení rezervace'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goBack = (e) => {
    e?.preventDefault?.()
    if (window.history.length > 1) window.history.back()
    else window.location.hash = ''
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setStatus('sending')
    setErrorMsg('')
    try {
      const payload = {
        ...data,
        sortimentLabels: SORTIMENT_OPTIONS.filter((o) =>
          data.sortiment.includes(o.id)
        ).map((o) => o.label),
      }
      const res = await fetch('/api/registrace-prodejce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || `Server vrátil ${res.status}`)
      }
      setStatus('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
            <h1>Přihláška byla odeslána!</h1>
            <p>
              Děkujeme za zájem prodávat na <strong>Trzích Ráje mazlíčků</strong>.
              Vaši přihlášku jsme předali organizátorům trhů.
            </p>
            <p className="reg-success-note">
              Ozveme se vám e-mailem se všemi podrobnostmi k nejbližšímu
              termínu. Mezitím si můžete prohlédnout informace o trzích nebo
              nás kdykoliv kontaktovat na uvedeném telefonním čísle.
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
            <Store size={14} /> Trhy Ráje mazlíčků
          </span>
          <h1 className="reg-title">Registrace prodejce</h1>
          <p className="reg-lead">
            Vyplňte přihlášku – ozveme se vám s detaily k nejbližšímu termínu.
            V případě zájmu o přihlášení na obě lokace vyplňte formulář zvlášť.
          </p>
        </div>

        <form className="reg-form" onSubmit={onSubmit} noValidate>
          {/* Město */}
          <Field
            label="Město konání akce"
            required
            error={errors.city}
            hint="V případě zájmu o obě lokace vyplňte formulář zvlášť."
            full
          >
            <div className="reg-branches reg-branches-2">
              {[
                { id: 'chodov', name: 'Chodov' },
                { id: 'cheb', name: 'Cheb' },
              ].map((c) => (
                <label
                  key={c.id}
                  className={`reg-branch${
                    data.city === c.id ? ' is-active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="city"
                    value={c.id}
                    checked={data.city === c.id}
                    onChange={() => setField('city', c.id)}
                  />
                  <span className="reg-branch-name">{c.name}</span>
                  <span className="reg-branch-meta">Trhy Ráje mazlíčků</span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="Jméno a příjmení" required error={errors.fullName}>
            <input
              type="text"
              autoComplete="name"
              value={data.fullName}
              onChange={(e) => setField('fullName', e.target.value)}
              placeholder="Jan Novák"
            />
          </Field>

          <Field
            label="IČ"
            hint="Vyplní podnikatelé (volitelné)"
            error={errors.ico}
          >
            <input
              type="text"
              inputMode="numeric"
              value={data.ico}
              onChange={(e) => setField('ico', e.target.value)}
              placeholder="12345678"
            />
          </Field>

          <Field
            label="Telefon"
            required
            hint="Bez mezer"
            error={errors.phone}
          >
            <input
              type="tel"
              autoComplete="tel"
              value={data.phone}
              onChange={(e) => setField('phone', e.target.value)}
              placeholder="+420777888999"
            />
          </Field>

          <Field
            label="E-mailová adresa"
            required
            hint="Pro odeslání potvrzení"
            error={errors.email}
          >
            <input
              type="email"
              autoComplete="email"
              value={data.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="vy@email.cz"
            />
          </Field>

          {/* Sortiment – checkbox grid */}
          <Field
            label="Sortiment"
            required
            error={errors.sortiment}
            hint="Vyberte vše, co plánujete nabízet."
            full
          >
            <div className="reg-checks-grid">
              {SORTIMENT_OPTIONS.map((o) => {
                const checked = data.sortiment.includes(o.id)
                return (
                  <label
                    key={o.id}
                    className={`reg-check-pill${checked ? ' is-active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSortiment(o.id)}
                    />
                    <span>{o.label}</span>
                  </label>
                )
              })}
            </div>
          </Field>

          {/* Fotka */}
          <Field
            label="Fotografie sortimentu na Facebook"
            hint="Volitelné – max. 1 fotografie do 6 MB"
            error={errors.photo}
            full
          >
            <label className="reg-file">
              <input
                type="file"
                accept="image/*"
                onChange={onPhotoChange}
              />
              <Upload size={18} />
              <span>
                {data.photoName
                  ? `${data.photoName} (${Math.round(data.photoSize / 1024)} kB)`
                  : 'Vybrat soubor…'}
              </span>
            </label>
          </Field>

          <Field
            label="Počet prodejních stolů"
            required
            error={errors.tablesCount}
          >
            <input
              type="number"
              min="1"
              max="20"
              value={data.tablesCount}
              onChange={(e) => setField('tablesCount', e.target.value)}
              placeholder="1"
            />
          </Field>

          <Field
            label="Příprava místa den předem"
            required
            error={errors.prepareDayBefore}
            hint="Mezi 16:00 – 18:00 den před akcí."
          >
            <div className="reg-yesno">
              {[
                { id: 'ano', label: 'Ano' },
                { id: 'ne', label: 'Ne' },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`reg-yesno-opt${
                    data.prepareDayBefore === opt.id ? ' is-active' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="prepareDayBefore"
                    value={opt.id}
                    checked={data.prepareDayBefore === opt.id}
                    onChange={() => setField('prepareDayBefore', opt.id)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </Field>

          <Field
            label="Poznámka"
            hint="Přihlašujete se na nejbližší možný termín. Zde je prostor pro případnou poznámku."
            full
          >
            <textarea
              rows={3}
              value={data.note}
              onChange={(e) => setField('note', e.target.value)}
              placeholder="Cokoliv, co bychom měli vědět…"
            />
          </Field>

          <Field
            label="Heslo pro zrušení rezervace"
            required
            error={errors.cancelPassword}
            hint="Slouží jako ověření, kdybyste rezervaci chtěli později zrušit."
            full
          >
            <input
              type="text"
              value={data.cancelPassword}
              onChange={(e) => setField('cancelPassword', e.target.value)}
              placeholder="Vaše heslo / kódové slovo"
            />
          </Field>

          <div className="reg-consents">
            <Consent
              checked={data.consentRules}
              onChange={(v) => setField('consentRules', v)}
              error={errors.consentRules}
            >
              Souhlasím s <a href="#">řádem akce</a> Trhy Ráje mazlíčků včetně
              ustanovení týkajících se <strong>GDPR</strong>.
            </Consent>
            <Consent
              checked={data.consentAnimals}
              onChange={(v) => setField('consentAnimals', v)}
              error={errors.consentAnimals}
            >
              Jsou mi známy zásady ochrany zvířat při prodeji na chovatelských
              trzích a přijímám povinnost dodržovat aktuální hygienická opatření.
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
              'Odeslat přihlášku'
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
    <label
      className={`reg-field${full ? ' is-full' : ''}${
        error ? ' has-error' : ''
      }`}
    >
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

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      // odstraň "data:image/...;base64," prefix
      const comma = result.indexOf(',')
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
