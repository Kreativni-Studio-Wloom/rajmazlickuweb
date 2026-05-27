// Vercel serverless funkce – přihláška prodejce na Trhy Ráje mazlíčků.
// Vždy odesílá na info@rajmazlicku.eu (přes Seznam SMTP, stejně jako customer
// registrace). Konfigurace přes stejné SMTP_* env proměnné.

import nodemailer from 'nodemailer'

const CITY_NAMES = { chodov: 'Chodov', cheb: 'Cheb' }

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export const config = {
  api: {
    bodyParser: { sizeLimit: '8mb' },
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const data = typeof req.body === 'string' ? safeJson(req.body) : req.body
  if (!data) return res.status(400).json({ error: 'Neplatný formát požadavku' })

  const {
    city,
    fullName,
    ico,
    phone,
    email,
    sortimentLabels = [],
    prepareDayBefore,
    tablesCount,
    note,
    consentRules,
    consentAnimals,
    cancelPassword,
    photo, // { name, type, content (base64) } | null
  } = data

  if (
    !city ||
    !fullName?.trim() ||
    !phone?.trim() ||
    !email?.trim() ||
    !sortimentLabels.length ||
    !tablesCount ||
    !prepareDayBefore ||
    !consentRules ||
    !consentAnimals ||
    !cancelPassword?.trim()
  ) {
    return res.status(400).json({ error: 'Chybí povinné údaje' })
  }

  const cityName = CITY_NAMES[city] || city
  const targetEmail = 'info@rajmazlicku.eu'

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
    secure: port === 465,
    auth: { user, pass },
  })

  const subject = `Přihláška prodejce – ${escapeHtml(fullName)} (Trhy ${cityName})`

  const text = [
    `Nová přihláška prodejce na Trhy Ráje mazlíčků`,
    ``,
    `Město konání: ${cityName}`,
    ``,
    `Jméno a příjmení: ${fullName}`,
    `IČ: ${ico || '(neuvedeno)'}`,
    `Telefon: ${phone}`,
    `E-mail: ${email}`,
    ``,
    `Sortiment: ${sortimentLabels.join(', ')}`,
    `Počet prodejních stolů: ${tablesCount}`,
    `Příprava místa den předem (16-18h): ${prepareDayBefore === 'ano' ? 'Ano' : 'Ne'}`,
    ``,
    `Poznámka:`,
    note?.trim() ? note : '(neuvedeno)',
    ``,
    `Heslo pro zrušení rezervace: ${cancelPassword}`,
    ``,
    `Souhlas s řádem akce + GDPR: ano`,
    `Souhlas se zásadami ochrany zvířat: ano`,
    ``,
    `Odesláno z webu rajmazlicku.eu`,
  ].join('\n')

  const html = `
    <div style="font-family:Arial,sans-serif;color:#00A79E;max-width:600px;margin:0 auto">
      <h2 style="color:#00A79E;margin-bottom:4px">Přihláška prodejce</h2>
      <p style="color:#02A69E;margin-top:0">
        Trhy Ráje mazlíčků – <strong>${escapeHtml(cityName)}</strong>
      </p>
      <table style="width:100%;border-collapse:collapse;margin-top:12px">
        ${row('Jméno a příjmení', escapeHtml(fullName))}
        ${row('IČ', ico ? escapeHtml(ico) : '<em>(neuvedeno)</em>')}
        ${row('Telefon', escapeHtml(phone))}
        ${row('E-mail', escapeHtml(email))}
        ${row(
          'Sortiment',
          sortimentLabels.map((l) => escapeHtml(l)).join(', ')
        )}
        ${row('Počet stolů', escapeHtml(String(tablesCount)))}
        ${row(
          'Příprava den předem',
          prepareDayBefore === 'ano' ? 'Ano' : 'Ne'
        )}
        ${row(
          'Poznámka',
          note?.trim() ? escapeHtml(note).replace(/\n/g, '<br>') : '<em>(neuvedeno)</em>'
        )}
        ${row('Heslo pro zrušení', escapeHtml(cancelPassword))}
      </table>
      <p style="margin-top:18px;color:#02A69E;font-size:13px">
        Prodejce souhlasil s řádem akce, GDPR a zásadami ochrany zvířat.
      </p>
      <p style="margin-top:6px;color:#02A69E;font-size:12px">
        Odesláno z webu rajmazlicku.eu
      </p>
    </div>
  `

  const attachments = []
  if (photo?.content && photo?.name) {
    attachments.push({
      filename: photo.name,
      content: photo.content,
      encoding: 'base64',
      contentType: photo.type || 'image/jpeg',
    })
  }

  try {
    await transporter.sendMail({
      from,
      to: targetEmail,
      replyTo: email,
      subject,
      text,
      html,
      attachments,
    })
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('SMTP error (vendor):', err)
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
