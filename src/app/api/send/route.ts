import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  // console.log("working:",process.env.RESEND_API_KEY);
  try {
    const { name, email, subject, message } = await req.json();

    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined');
    }

    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['singhpriyanshu305@gmail.com'],
      subject: `New Contact Form Submission: ${subject}`,
      replyTo: email,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
} 