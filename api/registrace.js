// Vercel serverless function – přijme registrační data a odešle e-mail
// na pobočku přes Seznam SMTP. Přístupné jako POST /api/registrace.
//
// Vyžaduje environment proměnné (nastav ve Vercel dashboardu nebo .env.local):
//   SMTP_HOST=smtp.seznam.cz
//   SMTP_PORT=465
//   SMTP_USER=info@rajmazlicku.eu
//   SMTP_PASS=********
//   SMTP_FROM="Ráj mazlíčků <info@rajmazlicku.eu>"  (volitelné, default = SMTP_USER)

import nodemailer from 'nodemailer'

const BRANCH_EMAILS = {
  kv: 'karlovy.vary@rajmazlicku.eu',
  chodov: 'chodov@rajmazlicku.eu',
  cheb: 'cheb@rajmazlicku.eu',
}
const BRANCH_NAMES = {
  kv: 'Karlovy Vary',
  chodov: 'Chodov',
  cheb: 'Cheb',
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('cs-CZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const data = typeof req.body === 'string' ? safeJson(req.body) : req.body
  if (!data) {
    return res.status(400).json({ error: 'Neplatný formát požadavku' })
  }

  const {
    fullName,
    address,
    birthDate,
    phone,
    email,
    pets,
    branch,
    consentTerms,
    consentGdpr,
  } = data

  if (
    !fullName?.trim() ||
    !address?.trim() ||
    !birthDate ||
    !phone?.trim() ||
    !email?.trim() ||
    !branch ||
    !consentTerms ||
    !consentGdpr
  ) {
    return res.status(400).json({ error: 'Chybí povinné údaje' })
  }

  const branchEmail = BRANCH_EMAILS[branch]
  const branchName = BRANCH_NAMES[branch]
  if (!branchEmail) {
    return res.status(400).json({ error: 'Neznámá pobočka' })
  }

  const host = process.env.SMTP_HOST || 'smtp.seznam.cz'
  const port = parseInt(process.env.SMTP_PORT || '465', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM || user

  if (!user || !pass) {
    return res
      .status(500)
      .json({ error: 'SMTP není nakonfigurováno na serveru' })
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL/TLS
    auth: { user, pass },
  })

  const subject = `Nová registrace Smečka – ${escapeHtml(fullName)} (${branchName})`
  const text = [
    `Nová registrace do věrnostního programu Smečka Ráje mazlíčků`,
    `Pobočka pro vyzvednutí: ${branchName}`,
    ``,
    `Jméno a příjmení: ${fullName}`,
    `Adresa: ${address}`,
    `Datum narození: ${formatDate(birthDate)}`,
    `Telefon: ${phone}`,
    `E-mail: ${email}`,
    ``,
    `Mazlíčci:`,
    pets?.trim() ? pets : '(neuvedeno)',
    ``,
    `Souhlas s obchodními podmínkami: ano`,
    `Souhlas se zpracováním osobních údajů: ano`,
    ``,
    `Odesláno z webu rajmazlicku.eu`,
  ].join('\n')

  const html = `
    <div style="font-family:Arial,sans-serif;color:#00A79E;max-width:560px;margin:0 auto">
      <h2 style="color:#00A79E;margin-bottom:4px">Nová registrace do Smečky</h2>
      <p style="color:#02A69E;margin-top:0">
        Pobočka pro vyzvednutí karty: <strong>${escapeHtml(branchName)}</strong>
      </p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px">
        ${row('Jméno a příjmení', escapeHtml(fullName))}
        ${row('Kompletní adresa', escapeHtml(address))}
        ${row('Datum narození', escapeHtml(formatDate(birthDate)))}
        ${row('Telefon', escapeHtml(phone))}
        ${row('E-mail', escapeHtml(email))}
        ${row(
          'Mazlíčci',
          pets?.trim()
            ? escapeHtml(pets).replace(/\n/g, '<br>')
            : '<em>(neuvedeno)</em>'
        )}
      </table>
      <p style="margin-top:18px;color:#02A69E;font-size:13px">
        Zákazník souhlasil s obchodními podmínkami i zpracováním osobních údajů.
      </p>
      <p style="margin-top:6px;color:#02A69E;font-size:12px">
        Odesláno z webu rajmazlicku.eu
      </p>
    </div>
  `

  try {
    await transporter.sendMail({
      from,
      to: branchEmail,
      replyTo: email,
      subject,
      text,
      html,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('SMTP error:', err)
    return res
      .status(502)
      .json({ error: 'Nepodařilo se odeslat e-mail. Zkuste to prosím znovu.' })
  }
}

function row(label, value) {
  return `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #E0F5F3;font-size:13px;color:#02A69E;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;width:35%;vertical-align:top">${label}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #E0F5F3;color:#00A79E;font-size:14px">${value}</td>
    </tr>
  `
}

function safeJson(str) {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}
