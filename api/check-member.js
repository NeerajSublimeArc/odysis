import MemberstackAdmin from "@memberstack/admin";

const memberstack = MemberstackAdmin.init(
  process.env.MEMBERSTACK_SECRET_KEY
);

export default async function handler(req, res) {

  // CORS
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://enroll.theodyssey.academy"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { email } = req.body;

    const members = await memberstack.members.list({
      search: email
    });

    const exists = members.data.some(
      (member) =>
        member.auth?.email?.toLowerCase() ===
        email.toLowerCase()
    );

    return res.status(200).json({
      exists
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Failed to check member"
    });
  }
}