import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = 'MoneyMind <noreply@moneymind.app>';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const headerColor = '#E8823D';

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${appUrl}/verify-email?token=${token}`;

  if (!resend) {
    console.log(`[DEV MODE Email] Verification link for ${email}: ${confirmLink}`);
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Verify your email for MoneyMind',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${headerColor}; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">MoneyMind</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Verify your email address</h2>
        <p>Please click the button below to verify your email address.</p>
        <a href="${confirmLink}" style="display: inline-block; background-color: ${headerColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 10px;">Verify Email</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">If you didn't request this, you can ignore this email.</p>
      </div>
    </div>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${appUrl}/reset-password?token=${token}`;

  if (!resend) {
    console.log(`[DEV MODE Email] Reset link for ${email}: ${resetLink}`);
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Reset your MoneyMind password',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${headerColor}; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">MoneyMind</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Reset your password</h2>
        <p>You recently requested to reset your password. Click the button below to proceed.</p>
        <a href="${resetLink}" style="display: inline-block; background-color: ${headerColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 10px;">Reset Password</a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    </div>`,
  });
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  if (!resend) {
    console.log(`[DEV MODE Email] Welcome email to ${name} (${email})`);
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Welcome to MoneyMind!',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${headerColor}; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">MoneyMind</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Welcome aboard, ${name}!</h2>
        <p>Thank you for joining MoneyMind. We're excited to help you manage your financial intelligence.</p>
        <p>Get started by logging in and setting up your dashboard.</p>
        <a href="${appUrl}/login" style="display: inline-block; background-color: ${headerColor}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 10px;">Go to Dashboard</a>
      </div>
    </div>`,
  });
};

export const sendLoginAlertEmail = async (email: string, device: string, location: string) => {
  if (!resend) {
    console.log(`[DEV MODE Email] Login alert to ${email} (Device: ${device}, Location: ${location})`);
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'New login to your MoneyMind account',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${headerColor}; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">MoneyMind</h1>
      </div>
      <div style="padding: 20px;">
        <h2>New Login Alert</h2>
        <p>We noticed a new login to your MoneyMind account.</p>
        <p><strong>Device:</strong> ${device}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">If this wasn't you, please reset your password immediately.</p>
      </div>
    </div>`,
  });
};

export const sendPasswordChangedEmail = async (email: string) => {
  if (!resend) {
    console.log(`[DEV MODE Email] Password changed alert to ${email}`);
    return;
  }

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: 'Your MoneyMind password was changed',
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${headerColor}; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">MoneyMind</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Password Changed</h2>
        <p>Your password has been successfully updated.</p>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">If you didn't make this change, please contact support immediately.</p>
      </div>
    </div>`,
  });
};
