const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = async (req, res) => {

  // CORS
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://odyssay-trendy-site.canvas.webflow.com'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, OPTIONS'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: 'Email is required'
    });
  }

  const otp =
    Math.floor(100000 + Math.random() * 900000);

  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`,
    html: `<strong>Your OTP is ${otp}</strong>`
  };

  try {

    await sgMail.send(msg);

    return res.status(200).json({
      success: true,
      otp
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Failed to send OTP'
    });

  }
};