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

  if (!email ) {
  return res.status(400).json({
    error: 'Email  are required'
  });
}
  


  try {
    const passwordSetupLink =
      `https://odyssay-trendy-site.webflow.io/passwprdreset?email=${encodeURIComponent(email)}`;

    await sgMail.send({
    to: email,
    from: process.env.SENDER_EMAIL,
    templateId: 'd-d07f2c5d02f240f2b600f070d84931f6',
    dynamicTemplateData: {
        password_setup_link: passwordSetupLink,
        sales_funnel_url: "https://odyssey-academy.webflow.io/"
    }
  });


    return res.status(200).json({
      success: true,
      
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: 'Failed to send Newsletter'
    });

  }
};