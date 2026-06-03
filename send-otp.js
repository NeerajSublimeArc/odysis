const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL, // Verified SendGrid sender
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`,
    html: `<strong>Your OTP is ${otp}</strong>`,
  };

  try {
    await sgMail.send(msg);

    return res.status(200).json({
      success: true,
      otp, // Remove this in production
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Failed to send OTP',
    });
  }
};