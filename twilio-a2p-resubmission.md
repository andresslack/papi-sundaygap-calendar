# Twilio A2P 10DLC — Corrected Campaign Fields (resubmission)

**Rejection reason:** "rejected because of provided Opt-in information."
**Root cause:** consent was collected by the organizer checking a box *on the caregiver's behalf*. Carriers require the **recipient** to opt in. Fix = double opt-in (caregiver confirms by SMS reply). Every field below is written to match that flow. The privacy policy has been updated to describe the same flow — the two must agree or it gets rejected again.

> ⚠️ The consent description claims the app sends a confirmation text and waits for a YES reply. **This must actually be true before you resubmit.** See "Required app change" at the bottom.

---

## Campaign description
Sends a weekly SMS reminder and link to family caregivers for an upcoming Sunday 6–8 PM elder-care shift. Caregivers are added by the family organizer with their permission and must reply YES to a confirmation text before any reminders are sent. Low volume, single family, approximately one message per caregiver per week.

## Sample message #1
Hi Alexandra, reminder that you are scheduled for Papi's care this Sunday 6/21 from 6:00–8:00 PM. App: https://papi-sundaygap.netlify.app Reply STOP to opt out, HELP for help. Msg & data rates may apply.

## Sample message #2
Sunday Care Schedule: you've been added to receive reminders for Papi's Sunday care shift (6–8 PM). Reply YES to confirm, STOP to opt out. Msg & data rates may apply. 1 msg/week. Privacy: https://papi-sundaygap.netlify.app/privacy-policy.html

## Sample message #3
Hi Andres, reminder that you are scheduled for Papi's care this Sunday 6/21 from 6:00–8:00 PM. App: https://papi-sundaygap.netlify.app Reply STOP to opt out. Msg & data rates may apply.

> Note: make Sample #1 the confirmation/opt-in message and #2/#3 the reminders, or keep this order — just ensure at least one sample is the opt-in confirmation and every sample carries opt-out + rate language. The earlier submission's Sample #1 had no STOP language; that inconsistency hurts you.

---

## How do end-users consent to receive messages?
Caregivers consent through a two-step (double opt-in) process. (1) With the caregiver's verbal permission, the family organizer enters the caregiver's first name and mobile number in the caregiver management panel at https://papi-sundaygap.netlify.app and checks a box confirming the caregiver agreed to be contacted. (2) The app then automatically sends the caregiver a one-time confirmation text reading: "Sunday Care Schedule: you've been added to receive reminders for Papi's Sunday care shift (6–8 PM). Reply YES to confirm, STOP to opt out. Msg & data rates may apply. 1 msg/week. Privacy: https://papi-sundaygap.netlify.app/privacy-policy.html". No shift reminders are sent unless the caregiver replies YES from their own phone. This is a private tool used by one family for eldercare coordination; numbers are never bought, sold, shared, or used for marketing. Opt-in is not a condition of any purchase. A screenshot of the consent step is published in the privacy policy at https://papi-sundaygap.netlify.app/privacy-policy.html.

## Opt-in keywords
YES, START, UNSTOP

## Opt-in message (the confirmation reply users receive)
You're confirmed for Sunday Care Schedule reminders for Papi's care shift (Sun 6–8 PM), about 1 msg/week. Reply HELP for help, STOP to cancel. Msg & data rates may apply.

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
STOP, STOPALL, UNSUBSCRIBE, CANCEL, END, QUIT, REVOKE, OPTOUT

## Opt-out message
You have successfully been unsubscribed from Sunday Care Schedule. You will not receive any more messages from this number. Reply START to resubscribe.

## Help keywords
HELP, INFO

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

## Required app change (do this BEFORE resubmitting)
The description above is only truthful once the app actually sends the confirmation text and gates reminders on a YES reply. Today, `netlify/functions/send-sms.js` only sends reminders. You need to: send the confirmation SMS when a caregiver is added, capture inbound replies (a Twilio inbound webhook → Netlify function) to record YES / STOP, and block reminder sends to any caregiver who hasn't confirmed. I can implement this for you.
