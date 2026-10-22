import { Resend } from 'resend';
import { env } from '../config/env.js';


const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {

  return resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject,
    html
  })
}