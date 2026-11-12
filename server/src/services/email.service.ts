import { Resend } from 'resend';
import { env } from '../config/env.js';


const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {

  const { data, error } = await resend.emails.send({
    from: "Orbit-Grad <no-reply@mail.orbit-grad.co.uk>",
    to,
    subject,
    html
  });

  if (error) {
    console.error("Resend email error", error);
    throw new Error(`Email delivery failed: ${error.message}`);
  }

  return data;
  // return resend.emails.send({
  //   from: 'onboarding@resend.dev',
  //   to,
  //   subject,
  //   html
  // })
}