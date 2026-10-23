import { Request, Response } from 'express';
import crypto from 'crypto';
import { processInboundSms } from '../conversation/engine.ts';

export async function handleTwilioInbound(req: Request, res: Response) {
  try {
    const fromPhone = req.body.From || req.body.from || '+17185550199';
    const bodyText = req.body.Body || req.body.body || '';

    if (!bodyText.trim()) {
      return res.status(200).type('text/xml').send('<Response></Response>');
    }

    const result = await processInboundSms(fromPhone, bodyText);

    // Escape XML entities in reply
    const escapedReply = result.replyText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapedReply}</Message>
</Response>`;

    res.status(200).type('text/xml').send(twiml);
  } catch (err: any) {
    console.error('Error in Twilio inbound handler:', err);
    res.status(500).type('text/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Haven NY is momentarily unavailable. Please try again shortly.</Message>
</Response>`);
  }
}

export function handleTwilioStatus(req: Request, res: Response) {
  // Log delivery status updates (e.g. delivered, failed, undelivered)
  const messageSid = req.body.MessageSid;
  const messageStatus = req.body.MessageStatus;
  // Never log raw message bodies
  console.log(`[Twilio Status] SID: ${messageSid}, Status: ${messageStatus}`);
  res.status(200).json({ ok: true });
}
