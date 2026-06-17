exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken  = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

    try {
        const { to, message } = JSON.parse(event.body);

        // Prefer the Messaging Service (holds the approved A2P campaign);
        // fall back to the raw number if the SID isn't configured.
        const params = { To: to, Body: message };
        if (messagingServiceSid) params.MessagingServiceSid = messagingServiceSid;
        else params.From = fromNumber;

        const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(params).toString()
            }
        );

        const data = await response.json();

        if (response.ok) {
            return { statusCode: 200, body: JSON.stringify({ success: true, sid: data.sid }) };
        } else {
            return { statusCode: 400, body: JSON.stringify({ error: data.message }) };
        }
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
