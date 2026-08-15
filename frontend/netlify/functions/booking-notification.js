// Netlify Function (free tier, no credit card required) - the serverless
// component of the project. Called by the tutoring-service whenever a new
// booking is created, so it can send a confirmation without the
// tutoring-service knowing about any email provider.

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ message: "Method not allowed" }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ message: "Invalid JSON body" }) };
  }

  const { studentName, studentEmail, tutorName, subject, sessionDate } = payload;

  if (!studentEmail || !tutorName || !sessionDate) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "studentEmail, tutorName and sessionDate are required" }),
    };
  }

  // In production this would call an email/SMS provider. For this project,
  // logging the notification is enough to demonstrate the serverless
  // workflow, and it shows up in Netlify's function logs.
  console.log(
    `Booking confirmation for ${studentName} <${studentEmail}>: session with ${tutorName} (${subject}) on ${sessionDate}`
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Notification processed" }),
  };
};
