// api/send-email.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, consultation_type, details } = req.body;

  // Simple validation
  if (!name || !phone || !email || !details) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Resend API Key is not configured' });
  }

  try {
    // 1. Send Notification Email to the Lawyer
    const lawyerEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Agora Law Firm <inquiries@agoralawfirm.com>', // Must be a verified domain in Resend
        to: 'hello@agoralawfirm.com',
        subject: `New Case Evaluation Request: ${name}`,
        html: `
          <h3>New Case Inquiry Received</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Consultation Type:</strong> ${consultation_type || 'General inquiry'}</p>
          <p><strong>Details/Needs:</strong></p>
          <p>${details.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    // 2. Send Confirmation Email to the Client
    const clientEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Shawn Roshan, Esq. <hello@agoralawfirm.com>', // Must be a verified domain in Resend
        to: email,
        subject: 'Thank you for reaching out to Agora Law Firm',
        html: `
          <p>Dear ${name},</p>
          <p>Thank you for requesting a consultation with Agora Law Firm. We have received your case details regarding <strong>${consultation_type || 'your inquiry'}</strong>.</p>
          <p>Discretion and diligence are our priorities. We will review your details shortly and contact you at <strong>${phone}</strong> within 1-2 business days.</p>
          <br>
          <p>Warm regards,</p>
          <p><strong>Shawn Roshan, Esq.</strong><br>Founder & Principal Attorney<br>Agora Law Firm</p>
        `,
      }),
    });

    if (lawyerEmailResponse.ok && clientEmailResponse.ok) {
      return res.status(200).json({ message: 'Emails sent successfully' });
    } else {
      const errorData = await lawyerEmailResponse.json();
      return res.status(500).json({ error: 'Failed to send one or both emails', details: errorData });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
