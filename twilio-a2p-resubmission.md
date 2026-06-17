# Twilio A2P 10DLC — Corrected Campaign Fields (resubmission)

**Rejection #3 reason (current):** "rejected due to issues verifying the Call to Action (CTA)."
**Root cause:** the reviewer couldn't independently verify how a caregiver is prompted to opt in — (a) the "opt-in keywords" and "opt-in message" fields were left BLANK, and (b) the opt-in happens inside a private/gated app, so there was no publicly accessible URL showing the opt-in CTA with all disclosures (carriers now require a live, accessible URL, not just a description).
**Fix:** a public opt-in CTA page is now live at https://papi-sundaygap.netlify.app/opt-in.html (all CTA disclosures + consent screenshot). Reference it in the CTA field, AND fill the two opt-in fields below.

(Earlier rejections: #1/#2 were "Opt-in information" — fixed by implementing real double opt-in. That part is done and is now also documented at the public URL.)

> ⚠️ Before submitting, also tick **"I confirm the information entered here is ready to submit for review"** at the bottom of the form, and double-check the opt-in keyword + opt-in message fields are NOT empty.

---

## Campaign description
Sends a weekly SMS reminder and link to family caregivers for an upcoming Sunday 6-8 PM elder-care shift. Caregivers are added by the family organizer with their permission and must reply YES to a confirmation text before any reminders are sent. Low volume, single family, approximately one message per caregiver per week.

## Sample message #1
Hi Alexandra, reminder that you are scheduled for Papi's care this Sunday 6/21 from 6:00-8:00 PM. App: https://papi-sundaygap.netlify.app Reply STOP to opt out, HELP for help. Msg & data rates may apply.

## Sample message #2
Sunday Care Schedule: you've been added to receive reminders for Papi's Sunday care shift (6-8 PM). Reply YES to confirm, STOP to opt out. Msg & data rates may apply. 1 msg/week. Privacy: https://papi-sundaygap.netlify.app/privacy-policy.html

## Sample message #3
Hi Andres, reminder that you are scheduled for Papi's care this Sunday 6/21 from 6:00-8:00 PM. App: https://papi-sundaygap.netlify.app Reply STOP to opt out. Msg & data rates may apply.

> Note: make Sample #1 the confirmation/opt-in message and #2/#3 the reminders, or keep this order — just ensure at least one sample is the opt-in confirmation and every sample carries opt-out + rate language. The earlier submission's Sample #1 had no STOP language; that inconsistency hurts you.

---

## How do end-users consent to receive messages? (Message Flow / CTA)
PUBLICLY VERIFIABLE OPT-IN CTA (live URL for the reviewer): https://papi-sundaygap.netlify.app/opt-in.html — this standalone page describes the opt-in flow, shows the consent screenshot, and lists every CTA disclosure (program name, message type, frequency "1 msg/week", "Msg & data rates may apply", STOP opt-out, HELP, customer-care email, Privacy Policy + Terms links).

Caregivers consent through a two-step (double opt-in) process. (1) With the caregiver's verbal permission, the family organizer enters the caregiver's first name and mobile number in the caregiver management screen of the app (a private, gated family tool) and confirms the caregiver agreed to be contacted; a screenshot of this consent step is hosted publicly at https://papi-sundaygap.netlify.app/opt-in.html and https://papi-sundaygap.netlify.app/privacy-policy.html. (2) The app then automatically sends the caregiver a one-time confirmation text reading: "Sunday Care Schedule: you've been added to receive reminders for Papi's Sunday care shift (6-8 PM). Reply YES to confirm, STOP to opt out. Msg & data rates may apply. 1 msg/week. Privacy: https://papi-sundaygap.netlify.app/privacy-policy.html". No shift reminders are sent unless the caregiver replies YES from their own phone (this YES reply is the binding opt-in). This is a private tool used by one family for eldercare coordination; numbers are never bought, sold, shared, or used for marketing. Opt-in is not a condition of any purchase.

⚠️ The two fields below were LEFT BLANK on the rejected submission — you MUST fill them this time. That blank opt-in info is a primary CTA-verification failure.

## Opt-in keywords
YES,START,UNSTOP

## Opt-in message (the confirmation reply users receive)
You're confirmed for Sunday Care Schedule reminders for Papi's care shift (Sun 6-8 PM), about 1 msg/week. Reply HELP for help, STOP to cancel. Msg & data rates may apply.

## Message contents checkboxes
- ☑ Embedded links (you link to papi-sundaygap.netlify.app) — keep checked
- ☐ Phone numbers — leave unchecked
- ☐ Direct lending / loan — leave unchecked
- ☐ Age-gated content — leave unchecked

## Privacy policy link
https://papi-sundaygap.netlify.app/privacy-policy.html

## Terms of service link
https://papi-sundaygap.netlify.app/terms.html

## Opt-out keywords
STOP,STOPALL,UNSUBSCRIBE,CANCEL,END,QUIT,REVOKE,OPTOUT

## Opt-out message
You have successfully been unsubscribed from Sunday Care Schedule. You will not receive any more messages from this number. Reply START to resubscribe.

## Help keywords
HELP,INFO

## Help message
Sunday Care Schedule reminders for Papi's care shift. About 1 msg/week. Reply STOP to unsubscribe. Msg & data rates may apply. Contact: andresslack@hotmail.com

---

## What changed vs. the rejected version
1. **Consent is now the caregiver's own SMS reply (YES), not an organizer checkbox.** This is the actual fix for the rejection.
2. **Opt-in keywords and opt-in message filled in** (were blank — a common silent reject).
3. **Every sample message now carries STOP + "Msg & data rates may apply"** (Sample #1 previously had neither).
4. **One sample is now the opt-in confirmation text itself**, so the reviewer can see the double opt-in.
5. **Message frequency stated** ("1 msg/week") and **"not a condition of purchase"** language added.
6. Privacy policy `How we obtain SMS consent` section rewritten to describe the same double opt-in flow.

## App change status — DONE (implemented June 16, 2026)
The double opt-in described above is fully implemented and live in the code, so the
consent description is truthful:
- Confirmation SMS: the "Send confirm" button sends via `netlify/functions/send-sms.js`
  and sets the caregiver to consentStatus="pending".
- Inbound replies: `netlify/functions/sms-reply.js` (Twilio inbound webhook) records
  YES → "confirmed" and STOP → "opted_out" in Firebase.
- Reminder gating: `sendReminder` in index.html only sends when consentStatus==="confirmed";
  there is no send-anyway override.

Remaining BEFORE resubmitting / going live (config, not code):
1. Point the Twilio Messaging webhook ("A message comes in", HTTP POST) at
   https://papi-sundaygap.netlify.app/.netlify/functions/sms-reply
2. (Recommended) add TWILIO_MESSAGING_SERVICE_SID env var in Netlify and redeploy.
3. Note: live SMS won't deliver until the A2P campaign is APPROVED (error 30034 until then).
