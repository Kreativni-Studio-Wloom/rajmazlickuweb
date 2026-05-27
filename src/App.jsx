import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Heart,
  MapPin,
  ArrowRight,
  Leaf,
  UserRound,
  Star,
  Shield,
  Users,
  X,
  Gift,
  Cake,
  CalendarDays,
  FileText,
  Fish,
  Bird,
  Sprout,
  Sparkles,
  Phone,
  Mail,
  Ticket,
  Clock,
} from 'lucide-react'
import logo from './assets/logo.svg'
import hero1 from './assets/hero1.jpg'
import hero2 from './assets/hero2.jpg'
import hero3 from './assets/hero3.jpg'
import hero4 from './assets/hero4.jpg'
import hero5 from './assets/hero5.jpg'
import storeKv from './assets/store-kv.jpg'
import storeChodov from './assets/store-chodov.jpeg'
import storeCheb from './assets/store-cheb.jpg'
import trhyImg from './assets/trhy.jpg'
import trhy1 from './assets/trhy1.jpg'
import trhy2 from './assets/trhy2.jpg'
import trhy3 from './assets/trhy3.jpg'
import trhy4 from './assets/trhy4.jpg'
import trhy5 from './assets/trhy5.jpg'
import trhy6 from './assets/trhy6.jpg'
import trhy7 from './assets/trhy7.jpg'
import trhy8 from './assets/trhy8.jpg'
import trhy9 from './assets/trhy9.jpg'
import znacka1 from './assets/znacka1.png'
import znacka2 from './assets/znacka2.png'
import znacka3 from './assets/znacka3.webp'
import znacka4 from './assets/znacka4.png'
import znacka5 from './assets/znacka5.webp'
import znacka6 from './assets/znacka6.webp'
import znacka7 from './assets/znacka7.png'
import znacka8 from './assets/znacka8.png'
import znacka9 from './assets/znacka9.png'
import znacka10 from './assets/znacka10.png'
import znacka11 from './assets/znacka11.png'
import znacka12 from './assets/znacka12.png'
import dotace1 from './assets/dotace1.png'
import dotace2 from './assets/dotace2.png'
import dotace3 from './assets/dotace3.png'
import dotace4 from './assets/dotace4.png'
import './App.css'

const HERO_IMAGES = [hero1, hero2, hero3, hero4, hero5]
const HERO_INTERVAL_MS = 10000

const TRHY_GALLERY = [trhy1, trhy2, trhy3, trhy4, trhy5, trhy6, trhy7, trhy8, trhy9]

/* Trhy Ráje mazlíčků – termíny pro Chodov 2026 (sobota 9:00). */
const CHODOV_DATES_2026 = [
  { iso: '2026-04-25T09:00:00+02:00', label: '25. dubna' },
  { iso: '2026-05-30T09:00:00+02:00', label: '30. května' },
  { iso: '2026-06-27T09:00:00+02:00', label: '27. června' },
  { iso: '2026-07-25T09:00:00+02:00', label: '25. července' },
  { iso: '2026-08-29T09:00:00+02:00', label: '29. srpna' },
  { iso: '2026-09-26T09:00:00+02:00', label: '26. září' },
  { iso: '2026-10-31T09:00:00+02:00', label: '31. října' },
  { iso: '2026-11-28T09:00:00+01:00', label: '28. listopadu' },
  { iso: '2026-12-19T09:00:00+01:00', label: '19. prosince' },
]

const BRANDS = [
  znacka1,
  znacka2,
  znacka3,
  znacka4,
  znacka5,
  znacka6,
  znacka7,
  znacka8,
  znacka9,
  znacka10,
  znacka11,
  znacka12,
]

/* Centerline path tvaru "vlna + srdce" pro kreslení tahem.
   Jeden souvislý tah: M start → C vlna vlevo → C levý lalok srdce → C pravý
   lalok srdce → C vlna vpravo. Pen se nezvedá, takže stroke-dashoffset
   animace tvoří plynulý kreslicí pohyb zleva doprava. */
const HEART_LINE_PATH =
  'M 40 210 ' +
  'C 150 320 330 270 450 205 ' +
  'C 350 125 350 25 450 95 ' +
  'C 550 25 550 125 450 205 ' +
  'C 570 270 750 320 860 210'

function App() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [smeckaOpen, setSmeckaOpen] = useState(false)
  const [trhyOpen, setTrhyOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const smeckaRef = useRef(null)
  const trhyRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % HERO_IMAGES.length)
    }, HERO_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!smeckaOpen) return
    const id = window.setTimeout(() => {
      smeckaRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 60)
    return () => window.clearTimeout(id)
  }, [smeckaOpen])

  useEffect(() => {
    if (!trhyOpen) return
    const id = window.setTimeout(() => {
      trhyRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 60)
    return () => window.clearTimeout(id)
  }, [trhyOpen])

  // countdown tikne každou sekundu, jen když je panel Trhy otevřený
  useEffect(() => {
    if (!trhyOpen) return
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [trhyOpen])

  // Deep-link přes URL hash:
  //   /#smecka-panel  → otevře Smečku
  //   /#trhy-panel    → otevře Trhy
  useEffect(() => {
    const sync = () => {
      const h = window.location.hash
      if (h === '#smecka-panel') setSmeckaOpen(true)
      else if (h === '#trhy-panel') setTrhyOpen(true)
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  // Zpětně synchronizuje URL hash se stavem panelů, aby šel odkaz zkopírovat z adresního řádku
  useEffect(() => {
    const path = window.location.pathname + window.location.search
    if (smeckaOpen) {
      if (window.location.hash !== '#smecka-panel') {
        window.history.replaceState(null, '', '#smecka-panel')
      }
    } else if (window.location.hash === '#smecka-panel') {
      window.history.replaceState(null, '', path)
    }
  }, [smeckaOpen])

  useEffect(() => {
    const path = window.location.pathname + window.location.search
    if (trhyOpen) {
      if (window.location.hash !== '#trhy-panel') {
        window.history.replaceState(null, '', '#trhy-panel')
      }
    } else if (window.location.hash === '#trhy-panel') {
      window.history.replaceState(null, '', path)
    }
  }, [trhyOpen])

  const nextChodov = useMemo(() => {
    for (const d of CHODOV_DATES_2026) {
      const t = new Date(d.iso).getTime()
      if (t > now) return { ...d, time: t }
    }
    return null
  }, [now])

  const countdown = useMemo(() => {
    if (!nextChodov) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    const diff = Math.max(0, nextChodov.time - now)
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }, [nextChodov, now])

  const toggleSmecka = (e) => {
    e.preventDefault()
    setSmeckaOpen((v) => !v)
  }

  const toggleTrhy = (e) => {
    e.preventDefault()
    setTrhyOpen((v) => !v)
  }

  return (
    <div className="page">
      {/* ============ HEADER ============ */}
      <header className="header">
        <div className="header-inner">
          <a className="logo" href="#">
            <img src={logo} alt="Ráj mazlíčků" />
          </a>

          <nav className="nav">
            <a href="#">O nás</a>
            <a href="#">Prodejny</a>
            <a href="#" className="nav-with-badge">
              Smečka
              <span className="nav-heart">
                <Heart size={10} fill="#00A79E" stroke="#00A79E" />
              </span>
            </a>
            <a href="#trhy-panel" onClick={toggleTrhy}>
              Trhy Ráje mazlíčků
            </a>
            <a href="#">Poradenství</a>
            <a href="#">Aktuality</a>
            <a href="#">Kontakt</a>
          </nav>

          <button className="cta-pill">
            <MapPin size={18} />
            <span>Najít prodejnu</span>
          </button>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <p className="hero-eyebrow">Spojujeme vás a vašeho mazlíčka</p>

            <h1 className="hero-title">
              Tady známe
              <br />
              <span className="hero-title-accent">
                vašeho mazlíčka jménem.
              </span>
            </h1>

            <p className="hero-desc">
              Jsme česká rodinná firma, která od roku 2011 provozuje síť
              kamenných prodejen s krmivy a chovatelskými potřebami. S láskou
              ke zvířatům a individuálním přístupem jsme tu pro vás i vaše
              mazlíčky.
            </p>

            <svg
              className="hero-squiggle heart-line-svg"
              viewBox="0 0 900 300"
              fill="none"
              aria-hidden="true"
            >
              <path
                className="heart-draw-path"
                pathLength="1"
                d={HEART_LINE_PATH}
              />
            </svg>

            <div className="hero-buttons">
              <button className="btn btn-primary">
                Zjistit více o nás
                <ArrowRight size={18} />
              </button>
              <button className="btn btn-outline">
                Naše prodejny
                <MapPin size={18} />
              </button>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-photo-wrap">
              {HERO_IMAGES.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  aria-hidden={i !== heroIndex}
                  className={`hero-photo${
                    i === heroIndex ? ' is-active' : ''
                  }`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchpriority={i === 0 ? 'high' : 'low'}
                />
              ))}
            </div>
            <div className="hero-bubble">
              <Heart size={22} fill="#fff" stroke="#fff" />
              <span>
                Krmíme
                <br />
                láskou,
                <br />
                radíme
                <br />
                srdcem
              </span>
            </div>
          </div>
        </div>

        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path
              d="M0,40 C240,0 480,60 720,30 C960,0 1200,50 1440,20 L1440,60 L0,60 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* ============ BENEFITS ============ */}
      <section className="benefits">
        <div className="benefits-inner">
          <BenefitItem
            icon={<Leaf size={28} strokeWidth={1.5} />}
            line1="Kvalitní krmiva"
            line2="prověřených značek"
          />
          <BenefitItem
            icon={<UserRound size={28} strokeWidth={1.5} />}
            line1="Individuální přístup"
            line2="a odborné poradenství"
          />
          <BenefitItem
            icon={<Heart size={28} strokeWidth={1.5} />}
            line1="Rodinná firma"
            line2="s láskou ke zvířatům"
          />
          <BenefitItem
            icon={<MapPin size={28} strokeWidth={1.5} />}
            line1="Síť prodejen"
            line2="po celé České republice"
          />
          <BenefitItem
            icon={<Star size={28} strokeWidth={1.5} />}
            line1="Věrnostní program"
            line2="pro naše zákazníky"
          />
        </div>
      </section>

      {/* ============ CARDS ============ */}
      <section className="cards">
        <div className="cards-inner">
          {/* Card 1: Loyalty */}
          <article className="card card-loyalty">
            <div className="card-content">
              <h3 className="card-title card-title-white">
                Smečka –<br />
                věrnostní program
              </h3>
              <p className="card-desc card-desc-white">
                Sbírejte body za nákupy, získejte odměny a exkluzivní výhody.
                Děkujeme, že jste součástí naší Smečky!
              </p>
              <a
                href="#smecka-panel"
                className="card-link card-link-white"
                onClick={toggleSmecka}
                aria-expanded={smeckaOpen}
                aria-controls="smecka-panel"
              >
                {smeckaOpen ? 'Zavřít' : 'Zjistit více'}{' '}
                <ArrowRight size={14} />
              </a>
            </div>
            <div className="phone-mockup">
              <div className="phone-frame">
                <div className="phone-screen">
                  <div className="phone-notch" />
                  <div className="phone-title">Smečka</div>
                  <div className="phone-points">
                    <div className="phone-points-coin">
                      <Star size={10} fill="#00A79E" stroke="#00A79E" />
                    </div>
                    <strong>410 bodů</strong>
                  </div>
                  <div className="phone-pets">
                    <div className="phone-pet phone-pet-1" />
                    <div className="phone-pet phone-pet-2" />
                    <div className="phone-pet phone-pet-3" />
                    <div className="phone-pet phone-pet-4" />
                  </div>
                  <div className="phone-reward">
                    <div className="phone-reward-row">
                      <span>Sleva na další nákup</span>
                      <span className="phone-reward-amount">100 Kč</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="phone-badge">
                <span className="phone-badge-label">Sleva</span>
                <span className="phone-badge-amount">100 Kč</span>
                <span className="phone-badge-note">na další nákup</span>
              </div>
            </div>
          </article>

          {/* Card 2: Trhy */}
          <article className="card card-advice">
            <div className="card-content">
              <h3 className="card-title">
                Trhy Ráje
                <br />
                mazlíčků
              </h3>
              <p className="card-desc">
                Pořádáme pravidelné komunitní trhy zaměřené na mazlíčky a
                chovatelství. Najdete zde lokální chovatele, kvalitní produkty
                a doplňky.
              </p>
              <a
                href="#trhy-panel"
                className="card-link"
                onClick={toggleTrhy}
                aria-expanded={trhyOpen}
                aria-controls="trhy-panel"
              >
                {trhyOpen ? 'Zavřít' : 'Více o trzích'}{' '}
                <ArrowRight size={14} />
              </a>
            </div>
            <div className="advice-photo">
              <img
                src={trhyImg}
                alt="Trhy Ráje mazlíčků"
                className="advice-photo-img"
                loading="lazy"
                decoding="async"
              />
            </div>
          </article>

          {/* Card 3: Stores */}
          <article className="card card-stores">
            <div className="stores-head">
              <div>
                <h3 className="card-title">Naše prodejny</h3>
                <p className="card-desc">
                  Najdete nás na mnoha místech
                  <br />
                  po celé Karlovarském kraji.
                </p>
                <a href="#" className="card-link">
                  Zobrazit všechny prodejny <ArrowRight size={14} />
                </a>
              </div>
              <KarlovyVaryMap />
            </div>

            <div className="stores-grid">
              <StoreCard
                img={storeKv}
                name="Karlovy Vary"
                street="Chebská 370/81"
                city="360 06 Karlovy Vary"
              />
              <StoreCard
                img={storeChodov}
                name="Chodov"
                street="Nerudova 588"
                city="357 35 Chodov"
              />
              <StoreCard
                img={storeCheb}
                name="Cheb"
                street="Obrněné brigády 16"
                city="350 02 Cheb"
              />
            </div>
          </article>

          {/* ===== Smečka expand panel (rozjede se pod 3 kartami) ===== */}
          <div
            ref={smeckaRef}
            id="smecka-panel"
            className={`smecka-wrap${smeckaOpen ? ' is-open' : ''}`}
            aria-hidden={!smeckaOpen}
          >
            <div className="smecka-panel">
              <button
                type="button"
                className="smecka-close"
                onClick={() => setSmeckaOpen(false)}
                aria-label="Zavřít panel Smečka"
              >
                <X size={20} strokeWidth={2.2} />
              </button>

              <div className="smecka-hero">
                <span className="smecka-eyebrow">Věrnostní program</span>
                <h2 className="smecka-title">
                  Vstupte do naší smečky a získejte
                  <br />
                  více než jen nákupy!
                </h2>
                <p className="smecka-intro">
                  Představujeme vám věrnostní program{' '}
                  <strong>Smečka Ráje mazlíčků</strong>, navržený s láskou a
                  péčí nejen pro vás, ale i pro vaše čtyřnohé kamarády.
                  Přidejte se k naší komunitě milovníků mazlíčků a objevte,
                  jaké výhody na vás čekají.
                </p>
                <button type="button" className="btn btn-primary btn-uppercase">
                  Registrovat se <ArrowRight size={18} />
                </button>
              </div>

              <div className="smecka-benefits">
                <SmeckaBenefit
                  icon={<Gift size={22} strokeWidth={1.8} />}
                  title="Exkluzivní nabídky"
                  text="Využijte speciálních nabídek a poukázek na produkty, které milujete. Každých 20 bodů si mimo jiné můžete směnit na 20 Kč na cokoliv."
                />
                <SmeckaBenefit
                  icon={<Cake size={22} strokeWidth={1.8} />}
                  title="Rozšířená péče"
                  text="Nechte se hýčkat nad rámec vašeho nákupu. Získejte odměnu k narozeninám či prodlouženou záruku na naše produkty."
                />
                <SmeckaBenefit
                  icon={<CalendarDays size={22} strokeWidth={1.8} />}
                  title="Členské události"
                  text="Účastněte se speciálních workshopů, přednášek a dalších společných aktivit určených pro členy smečky. Včetně Trhů Ráje mazlíčků v Chodově a Chebu."
                />
                <SmeckaBenefit
                  icon={<FileText size={22} strokeWidth={1.8} />}
                  title="Užitečné služby"
                  text="Čerpejte výhody jako jsou elektronické účtenky či přednostní informovanost o našich novinkách."
                />
              </div>

              <div className="smecka-section smecka-why">
                <h3 className="smecka-h3">Proč patřit do naší smečky?</h3>
                <p>
                  Věříme, že vztah mezi člověkem a jeho mazlíčkem je
                  jedinečný. Proto jsme vytvořili program, který posiluje
                  nejen vaši spokojenost, ale i pohodu vašich mazlíčků. Vaše
                  loajalita pro nás znamená mnohem více – je to cesta ke
                  společnému růstu a radosti.
                </p>
              </div>

              <div className="smecka-stats">
                <SmeckaStat n="7 500+" l="Druhů produktů" />
                <SmeckaStat n="3" l="Jedinečné pobočky" />
                <SmeckaStat n="150+" l="Uspořádaných událostí" />
                <SmeckaStat n="200+" l="Online recenzí" />
              </div>

              <div className="smecka-section smecka-how">
                <span className="smecka-eyebrow">Smečka Ráj mazlíčků</span>
                <h3 className="smecka-h3">Jak to funguje?</h3>
                <h4 className="smecka-h4">Sbírejte body za nákupy</h4>
                <p>
                  Za každých 50 Kč, které utratíte, získáte na svou věrnostní
                  kartu 1 bod. Tyto body můžete směnit za širokou škálu výhod.
                </p>
                <p>
                  Sledujte, jak vaše body rostou, a rozhodněte, za co je
                  proměníte – výběr je jen na vás!
                </p>
                <p>
                  Registrujte se ještě dnes a získejte svou věrnostní kartu v
                  jedné z našich prodejen. Členství je zdarma a benefity
                  čekají jen na vás!
                </p>
                <button type="button" className="btn btn-primary btn-uppercase">
                  Registrovat se <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* ===== Trhy expand panel ===== */}
          <div
            ref={trhyRef}
            id="trhy-panel"
            className={`trhy-wrap${trhyOpen ? ' is-open' : ''}`}
            aria-hidden={!trhyOpen}
          >
            <div className="trhy-panel">
              <button
                type="button"
                className="smecka-close"
                onClick={() => setTrhyOpen(false)}
                aria-label="Zavřít panel Trhy"
              >
                <X size={20} strokeWidth={2.2} />
              </button>

              <div className="trhy-hero">
                <span className="smecka-eyebrow">Trhy Ráje mazlíčků</span>
                <h2 className="smecka-title">
                  Trhy Ráje mazlíčků v Chodově a Chebu
                </h2>
                <p className="smecka-intro">
                  Vydejte se nahlédnout do{' '}
                  <strong>Trhů Ráje mazlíčků</strong> – největších
                  akvaristicko-teraristických trhů na západě Čech. Ponoříte se
                  u nás (nejen) pod vodní hladinu a zažijte skvělé sobotní
                  dopoledne plné poznání.
                </p>
              </div>

              {/* ===== COUNTDOWN ===== */}
              <div className="trhy-countdown">
                {nextChodov ? (
                  <>
                    <div className="trhy-countdown-label">
                      <Clock size={16} />
                      <span>
                        Nejbližší trh – Chodov, sobota {nextChodov.label} · 9–12 h
                      </span>
                    </div>
                    <div className="trhy-countdown-grid">
                      <CountUnit n={countdown.days} l="Dní" />
                      <CountUnit n={countdown.hours} l="Hodin" />
                      <CountUnit n={countdown.minutes} l="Minut" />
                      <CountUnit n={countdown.seconds} l="Sekund" />
                    </div>
                    <a
                      href="#"
                      className="btn btn-primary btn-uppercase trhy-tickets-btn"
                    >
                      <Ticket size={18} /> Vstupenky online
                    </a>
                  </>
                ) : (
                  <div className="trhy-countdown-label">
                    <Clock size={16} />
                    <span>Další termíny budou brzy oznámeny</span>
                  </div>
                )}
              </div>

              {/* ===== CHODOV ===== */}
              <article className="trhy-location is-primary">
                <header className="trhy-loc-head">
                  <div className="trhy-loc-badge">
                    <MapPin size={16} />
                    <span>Chodov</span>
                  </div>
                  <h3 className="trhy-loc-title">Trhy Ráje mazlíčků – Chodov</h3>
                  <p className="trhy-loc-place">
                    Společenský sál <strong>KASS Chodov</strong>, náměstí ČSM
                    1022 · bezbariérový boční vchod přímo k sálu
                  </p>
                  <p className="trhy-loc-desc">
                    Trhy každý měsíc připlouvají do velkého sálu Kulturního a
                    společenského střediska v Chodově, a přináší tak kus
                    divočiny a přírody do středu města.
                  </p>
                </header>

                <div className="trhy-loc-body">
                  <div className="trhy-dates">
                    <h4 className="trhy-h4">Termíny 2026</h4>
                    <ul className="trhy-dates-list">
                      {CHODOV_DATES_2026.map((d) => {
                        const past = new Date(d.iso).getTime() < now
                        const upcoming =
                          nextChodov && d.iso === nextChodov.iso
                        return (
                          <li
                            key={d.iso}
                            className={`trhy-date${past ? ' is-past' : ''}${
                              upcoming ? ' is-next' : ''
                            }`}
                          >
                            <CalendarDays size={14} />
                            <span>{d.label}</span>
                            {upcoming && (
                              <span className="trhy-date-tag">Nejbližší</span>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <div className="trhy-prices">
                    <h4 className="trhy-h4">Vstupné</h4>
                    <div className="trhy-price-row">
                      <div className="trhy-price">
                        <strong>60 Kč</strong>
                        <span>Dospělá vstupenka</span>
                      </div>
                      <div className="trhy-price">
                        <strong>10 Kč</strong>
                        <span>Děti do 15 let</span>
                      </div>
                    </div>
                    <a href="#" className="card-link">
                      Koupit online <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </article>

              {/* ===== CHEB ===== */}
              <article className="trhy-location">
                <header className="trhy-loc-head">
                  <div className="trhy-loc-badge trhy-loc-badge--muted">
                    <MapPin size={16} />
                    <span>Cheb</span>
                  </div>
                  <h3 className="trhy-loc-title">Trhy Ráje mazlíčků – Cheb</h3>
                  <p className="trhy-loc-place">
                    Sál <strong>FEK ZČU</strong>, Hradební 2047/22, Cheb ·
                    bezbariérový vedlejší vchod (poznávací bod – socha)
                  </p>
                </header>

                <div className="trhy-loc-body">
                  <div className="trhy-dates trhy-dates--announce">
                    <h4 className="trhy-h4">Další termín</h4>
                    <p className="trhy-announce">
                      Nejbližší termín bude teprve oznámen. Sledujte naše
                      novinky a prodejny Ráj mazlíčků pro aktuální informace.
                    </p>
                  </div>

                  <div className="trhy-prices">
                    <h4 className="trhy-h4">Vstupné</h4>
                    <div className="trhy-price-row">
                      <div className="trhy-price">
                        <strong>70 Kč</strong>
                        <span>Dospělá vstupenka</span>
                      </div>
                      <div className="trhy-price">
                        <strong>10 Kč</strong>
                        <span>Děti do 15 let</span>
                      </div>
                    </div>
                    <a href="#" className="card-link">
                      Předprodej <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              </article>

              {/* ===== NA CO SE TĚŠIT ===== */}
              <div className="trhy-section">
                <h3 className="smecka-h3">Na co se můžete těšit?</h3>
                <ul className="trhy-cats">
                  <TrhyCat
                    icon={<Fish size={18} />}
                    text="Akvarijní ryby, krevety, šneky a další vodní živočichy"
                  />
                  <TrhyCat
                    icon={<Sparkles size={18} />}
                    text="Hady, agamy, chameleony, želvy a další terarijní zvířata"
                  />
                  <TrhyCat
                    icon={<Sprout size={18} />}
                    text="Vodní i suchozemské rostliny (sezónně i venkovní)"
                  />
                  <TrhyCat
                    icon={<Bird size={18} />}
                    text="Andulky, zebřičky, korely a další ptactvo"
                  />
                  <TrhyCat
                    icon={<Heart size={18} />}
                    text="Křečky, morčata, králíky a další hlodavce"
                  />
                  <TrhyCat
                    icon={<Leaf size={18} />}
                    text="Široká škála krmiv vč. živého a mraženého hmyzu"
                  />
                  <TrhyCat
                    icon={<Gift size={18} />}
                    text="Veškeré příslušenství – klece, vybavení, dekorace"
                  />
                  <TrhyCat
                    icon={<Star size={18} />}
                    text="Krmiva, hračky a pamlsky pro psy a kočky"
                  />
                  <TrhyCat
                    icon={<Shield size={18} />}
                    text="Příležitostně krystaly, mušle a zkameněliny"
                  />
                </ul>
              </div>

              {/* ===== GALLERY 3x3 ===== */}
              <div className="trhy-gallery-wrap">
                <h3 className="smecka-h3">Jak to u nás vypadá</h3>
                <div className="trhy-gallery">
                  {TRHY_GALLERY.map((src, i) => (
                    <div className="trhy-gallery-item" key={src}>
                      <img
                        src={src}
                        alt={`Fotka z trhů ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* ===== KONTAKT ===== */}
              <div className="trhy-contact">
                <h3 className="smecka-h3">Kontaktujte nás</h3>
                <p>
                  Máte otázky? Zajímají vás podrobnosti, chcete u nás prodávat
                  nebo trhy sponzorovat? Ozvěte se nám – informace rádi
                  poskytneme i osobně na pobočkách Ráj mazlíčků.
                </p>
                <div className="trhy-contact-grid">
                  <a className="trhy-contact-item" href="tel:+420359901449">
                    <Phone size={18} />
                    <span>+420 359 901 449</span>
                  </a>
                  <a
                    className="trhy-contact-item"
                    href="mailto:info@zivotvevode.cz"
                  >
                    <Mail size={18} />
                    <span>info@zivotvevode.cz</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BRAND MARQUEE ============ */}
      <section className="brands" aria-label="Značky krmiv">
        <div className="brands-inner">
          <div className="brands-track">
            {[...BRANDS, ...BRANDS].map((src, i) => (
              <span className="brand-item" key={i}>
                <img
                  className="brand-logo"
                  src={src}
                  alt=""
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  aria-hidden="true"
                />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DOTACE / SPOLUFINANCOVANÉ PROJEKTY ============ */}
      <section className="dotace" aria-label="Spolufinancované projekty">
        <div className="dotace-inner">
          <span className="dotace-eyebrow">Spolufinancované projekty</span>
          <h2 className="dotace-title">Podpora rozvoje</h2>

          <div className="dotace-items">
            <article className="dotace-item">
              <p className="dotace-text">
                V roce 2025 poskytnuta dotace z rozpočtu{' '}
                <strong>Karlovarského kraje</strong> na realizaci projektu „
                <strong>Prodejní automat Ráj mazlíčků</strong>". Dotace byla
                využita na pořízení těla prodejního automatu.
              </p>
            </article>
            <article className="dotace-item">
              <p className="dotace-text">
                Projekt{' '}
                <strong>Marketingová strategie Ráje mazlíčků</strong> byl
                realizován za finanční podpory <strong>Evropské unie</strong>{' '}
                prostřednictvím <strong>Národního plánu obnovy</strong> a{' '}
                <strong>Ministerstva kultury ČR</strong>. Cílem projektu bylo
                vytvoření marketingové strategie, nové vizuální identity a
                optimalizace zákaznické cesty pro dlouhodobý rozvoj značky a
                posílení její konkurenceschopnosti.
              </p>
            </article>
          </div>

          <div className="dotace-logos" aria-label="Loga partnerů a poskytovatelů dotací">
            <DotaceLogo src={dotace1} alt="Karlovarský kraj" />
            <DotaceLogo src={dotace2} alt="Evropská unie" />
            <DotaceLogo src={dotace3} alt="Národní plán obnovy" />
            <DotaceLogo src={dotace4} alt="Ministerstvo kultury ČR" />
          </div>
        </div>
      </section>

      {/* ============ VALUES STRIP ============ */}
      <section className="values">
        <div className="values-wave-top" aria-hidden="true">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
            <path
              d="M0,30 C240,60 480,0 720,30 C960,60 1200,10 1440,40 L1440,0 L0,0 Z"
              fill="#ffffff"
            />
          </svg>
        </div>

        <div className="values-inner">
          <div className="values-dog" aria-hidden="true">
            <DogIllustration />
          </div>

          <div className="values-grid">
            <ValueItem
              icon={<Heart size={22} strokeWidth={1.6} />}
              title="Láska ke zvířatům"
              text={
                <>
                  Zvířata milujeme
                  <br />a rozumíme jim.
                </>
              }
            />
            <ValueItem
              icon={<Shield size={22} strokeWidth={1.6} />}
              title="Kvalita na prvním místě"
              text={
                <>
                  Pečlivě vybíráme produkty,
                  <br />
                  které nabízíme.
                </>
              }
            />
            <ValueItem
              icon={<Users size={22} strokeWidth={1.6} />}
              title="Férový přístup"
              text={
                <>
                  Jednáme otevřeně,
                  <br />
                  lidsky a férově.
                </>
              }
            />
            <ValueItem
              icon={<Leaf size={22} strokeWidth={1.6} />}
              title="Odpovědnost"
              text={
                <>
                  Podporujeme odpovědný
                  <br />
                  chov a krmení.
                </>
              }
            />
          </div>

          <div className="values-cat" aria-hidden="true">
            <CatIllustration />
          </div>
        </div>
      </section>
    </div>
  )
}

function BenefitItem({ icon, line1, line2 }) {
  return (
    <div className="benefit">
      <div className="benefit-icon">{icon}</div>
      <div className="benefit-text">
        <strong>{line1}</strong>
        <span>{line2}</span>
      </div>
    </div>
  )
}

function StoreCard({ img, name, street, city }) {
  return (
    <div className="store-card">
      <div className="store-photo">
        <img src={img} alt={name} />
      </div>
      <div className="store-info">
        <strong>{name}</strong>
        <span>{street}</span>
        <span>{city}</span>
      </div>
    </div>
  )
}

function ValueItem({ icon, title, text }) {
  return (
    <div className="value">
      <div className="value-icon">{icon}</div>
      <div className="value-text">
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  )
}

/* ============ Karlovarský kraj SVG map ============ */
function KarlovyVaryMap() {
  return (
    <svg
      className="kv-map"
      viewBox="0 0 280 160"
      fill="none"
      aria-hidden="true"
    >
      {/* simplified shape of Karlovarský kraj */}
      <path
        d="M18 78
           C 22 55, 38 38, 60 36
           C 78 34, 92 42, 108 38
           C 128 33, 148 28, 168 34
           C 188 40, 208 44, 226 52
           C 248 62, 262 80, 258 102
           C 254 122, 232 132, 208 130
           C 184 128, 162 122, 142 126
           C 122 130, 100 132, 78 126
           C 56 120, 32 110, 22 96
           C 16 88, 16 84, 18 78 Z"
        fill="rgba(0, 167, 158, 0.08)"
        stroke="#00A79E"
        strokeWidth="1.5"
      />
      {/* small decorative pins for other places */}
      <g opacity="0.4">
        <circle cx="90" cy="60" r="2" fill="#00A79E" />
        <circle cx="120" cy="92" r="2" fill="#00A79E" />
        <circle cx="190" cy="70" r="2" fill="#00A79E" />
        <circle cx="220" cy="100" r="2" fill="#00A79E" />
      </g>

      {/* Cheb (left) */}
      <MapPinSvg x={56} y={80} color="#00A79E" />
      <text x={56} y={108} textAnchor="middle" className="kv-map-label">
        Cheb
      </text>

      {/* Chodov (middle) – zvýrazněný */}
      <MapPinSvg x={138} y={74} color="#00A79E" highlight />
      <text x={138} y={102} textAnchor="middle" className="kv-map-label">
        Chodov
      </text>

      {/* Karlovy Vary (right) */}
      <MapPinSvg x={210} y={80} color="#00A79E" />
      <text x={210} y={108} textAnchor="middle" className="kv-map-label">
        Karlovy Vary
      </text>
    </svg>
  )
}

function SmeckaBenefit({ icon, title, text }) {
  return (
    <div className="smecka-benefit">
      <div className="smecka-benefit-icon">{icon}</div>
      <h4 className="smecka-benefit-title">{title}</h4>
      <p className="smecka-benefit-text">{text}</p>
    </div>
  )
}

function SmeckaStat({ n, l }) {
  return (
    <div className="smecka-stat">
      <strong>{n}</strong>
      <span>{l}</span>
    </div>
  )
}

function CountUnit({ n, l }) {
  return (
    <div className="count-unit">
      <strong>{String(n).padStart(2, '0')}</strong>
      <span>{l}</span>
    </div>
  )
}

function TrhyCat({ icon, text }) {
  return (
    <li className="trhy-cat">
      <span className="trhy-cat-icon">{icon}</span>
      <span>{text}</span>
    </li>
  )
}

function DotaceLogo({ src, alt }) {
  return (
    <a
      href="https://www.kr-karlovarsky.cz"
      target="_blank"
      rel="noopener noreferrer"
      className="dotace-logo"
      title={alt}
      aria-label={alt}
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </a>
  )
}

function MapPinSvg({ x, y, color, highlight }) {
  return (
    <g transform={`translate(${x - 8} ${y - 18})`}>
      {highlight && (
        <circle
          cx="8"
          cy="8"
          r="14"
          fill="none"
          stroke="#00A79E"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
      )}
      <path
        d="M8 0 C13 0, 16 4, 16 8 C16 14, 8 22, 8 22 C8 22, 0 14, 0 8 C0 4, 3 0, 8 0 Z"
        fill={color}
      />
      <circle cx="8" cy="8" r="3" fill="#ffffff" />
    </g>
  )
}

/* ============ Decorative illustrations ============ */
function DogIllustration() {
  return (
    <svg viewBox="0 0 220 200" fill="none">
      {/* body */}
      <ellipse cx="120" cy="150" rx="70" ry="40" fill="#ffffff" />
      {/* head */}
      <circle cx="70" cy="110" r="45" fill="#ffffff" />
      {/* ear */}
      <path
        d="M40 80 C30 70, 30 95, 45 100 Z"
        fill="#ffffff"
        stroke="#ffffff"
        strokeWidth="2"
      />
      {/* body outline */}
      <ellipse
        cx="120"
        cy="150"
        rx="70"
        ry="40"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        fill="none"
      />
      <circle
        cx="70"
        cy="110"
        r="45"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        fill="none"
      />
      {/* eye */}
      <circle cx="60" cy="105" r="3" fill="#00A79E" />
      {/* nose */}
      <ellipse cx="40" cy="118" rx="4" ry="3" fill="#00A79E" />
      {/* mouth */}
      <path
        d="M40 124 Q48 130 56 124"
        stroke="#00A79E"
        strokeWidth="1.5"
        fill="none"
      />
      {/* heart */}
      <g transform="translate(115 95)">
        <path
          d="M0 6 C0 1, 6 -2, 10 2 C14 -2, 20 1, 20 6 C20 12, 10 20, 10 20 C10 20, 0 12, 0 6 Z"
          fill="#00A79E"
        />
      </g>
      {/* legs */}
      <rect
        x="155"
        y="170"
        width="10"
        height="20"
        rx="4"
        fill="#ffffff"
      />
      <rect
        x="90"
        y="175"
        width="10"
        height="18"
        rx="4"
        fill="#ffffff"
      />
    </svg>
  )
}

function CatIllustration() {
  return (
    <svg viewBox="0 0 220 200" fill="none">
      {/* body */}
      <ellipse cx="110" cy="140" rx="55" ry="50" fill="#ffffff" />
      <ellipse
        cx="110"
        cy="140"
        rx="55"
        ry="50"
        stroke="#ffffff"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        fill="none"
      />
      {/* ears */}
      <path
        d="M75 95 L80 70 L95 90 Z"
        fill="#ffffff"
      />
      <path
        d="M145 95 L140 70 L125 90 Z"
        fill="#ffffff"
      />
      {/* face details */}
      <circle cx="95" cy="125" r="3" fill="#00A79E" />
      <circle cx="125" cy="125" r="3" fill="#00A79E" />
      <path
        d="M105 138 Q110 144 115 138"
        stroke="#00A79E"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M110 132 L107 138 L113 138 Z" fill="#00A79E" />
      {/* whiskers */}
      <path d="M80 138 L100 137" stroke="#00A79E" strokeWidth="1" />
      <path d="M140 137 L120 138" stroke="#00A79E" strokeWidth="1" />
      {/* tail / paw waving */}
      <path
        d="M165 100 C 185 80, 195 60, 188 40"
        stroke="#ffffff"
        strokeWidth="2"
        fill="none"
      />
      {/* feather toy */}
      <g transform="translate(180 30)">
        <path
          d="M0 0 C -8 -10, -4 -22, 6 -20 C 14 -18, 12 -4, 0 0 Z"
          fill="#ffffff"
        />
        <path
          d="M2 -2 C -4 -12, 0 -18, 8 -18"
          stroke="#00A79E"
          strokeWidth="1"
          fill="none"
        />
      </g>
    </svg>
  )
}

export default App
