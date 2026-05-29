const BASE_URL = "https://forensicinstitute.in"; 

// GET Contact Page Data
export async function getContactPageData() {
  const res = await fetch(`${BASE_URL}/contact-page/get-contact-information`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch contact data");
  }

  return res.json();
}

// POST Contact Form
export async function submitContactForm(payload: {
  name: string;
  email: string;
  contact_number: string;
  address: string;
  details: string;
}) {
  const res = await fetch(`${BASE_URL}/contact-page/send-contact-mail/submit-contact-form`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
}
