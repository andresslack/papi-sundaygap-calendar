// Twilio inbound SMS webhook — handles double opt-in confirmations and opt-outs.
//
// Configure in Twilio Console → Phone Numbers → your number → Messaging →
// "A MESSAGE COMES IN" → Webhook (HTTP POST):
//   https://papi-sundaygap.netlify.app/.netlify/functions/sms-reply
//
// When a caregiver replies YES we mark their record consentStatus="confirmed"
// in Firebase, which is the binding opt-in that lets reminders be sent.
// STOP marks them "opted_out". Requires TWILIO_AUTH_TOKEN env var (for
// request-signature validation).

const crypto = require('crypto');

const DB = 'https://papi-sundaygap-default-rtdb.firebaseio.com';

const START_WORDS = ['YES', 'START', 'UNSTOP', 'CONFIRM', 'YEAH', 'YEP'];
const STOP_WORDS  = ['STOP', 'STOPALL', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT', 'REVOKE', 'OPTOUT'];
const HELP_WORDS  = ['HELP', 'INFO'];

const last10 = (p) => (p || '').replace(/\D/g, '').slice(-10);

function xmlEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function twiml(message) {
  const body = message
    ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${xmlEscape(message)}</Message></Response>`
    : `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
  return { statusCode: 200, headers: { 'Content-Type': 'text/xml' }, body };
}

// Validate the X-Twilio-Signature so only Twilio can change consent state.
// https://www.twilio.com/docs/usage/security#validating-requests
function validateTwilio(event, params) {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const signature = event.headers['x-twilio-signature'] || event.headers['X-Twilio-Signature'];
  if (!authToken || !signature) return false;
  const proto = event.headers['x-forwarded-proto'] || 'https';
  const host  = event.headers['host'] || event.headers['Host'];
  const url   = `${proto}://${host}${event.path}`;
  const data  = url + Object.keys(params).sort().map(k => k + params[k]).join('');
  const expected = crypto.createHmac('sha1', authToken).update(Buffer.from(data, 'utf-8')).digest('base64');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  // Twilio posts application/x-www-form-urlencoded (sometimes base64 on Netlify)
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf-8')
    : (event.body || '');
  const params = {};
  new URLSearchParams(rawBody).forEach((v, k) => { params[k] = v; });

  if (!validateTwilio(event, params)) {
    return { statusCode: 403, body: 'Invalid Twilio signature' };
  }

  const from = params.From || '';
  const text = (params.Body || '').trim().toUpperCase().replace(/[^A-Z]/g, '');
  const fromKey = last10(from);

  // Find the caregiver by phone (Firebase may return an array or an object)
  let entries = [];
  try {
    const r = await fetch(`${DB}/caregivers.json`);
    const raw = await r.json();
    if (Array.isArray(raw)) entries = raw.map((c, i) => [String(i), c]);
    else if (raw && typeof raw === 'object') entries = Object.entries(raw);
  } catch {
    return twiml(''); // never error back to Twilio
  }

  const match = entries.find(([, c]) => c && fromKey.length === 10 && last10(c.phone) === fromKey);

  const setConsent = async (status) => {
    if (!match) return;
    await fetch(`${DB}/caregivers/${match[0]}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consentStatus: status, smsOptIn: status === 'confirmed' })
    });
  };

  if (START_WORDS.includes(text)) {
    await setConsent('confirmed');
    return twiml("You're confirmed for Sunday Care Schedule reminders for Papi's care shift (Sun 6-8 PM), about 1 msg/week. Reply HELP for help, STOP to cancel. Msg & data rates may apply.");
  }

  if (STOP_WORDS.includes(text)) {
    await setConsent('opted_out');
    // Twilio's carrier-level Advanced Opt-Out sends the STOP confirmation; stay silent to avoid a double reply.
    return twiml('');
  }

  if (HELP_WORDS.includes(text)) {
    return twiml("Sunday Care Schedule reminders for Papi's care shift. About 1 msg/week. Reply YES to confirm, STOP to unsubscribe. Msg & data rates may apply. Contact: andresslack@hotmail.com");
  }

  // Anything else: nudge toward the keywords.
  return twiml('Sunday Care Schedule: reply YES to confirm reminders, STOP to opt out, HELP for help.');
};
