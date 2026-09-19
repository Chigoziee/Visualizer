// Sample "events" data for the MongoDB test connection.
// 200 synthetic user activity events spanning Jan-Jun 2026, so prompts like
// "events by referral channel" or "signups over time" have real substance.
// Runs in the context of MONGO_INITDB_DATABASE ("activity").

const eventTypes = ["page_view", "signup", "purchase", "churn", "referral_click"];
const channels = ["organic", "twitter", "google_ads", "partner", "email"];

const events = [];
for (let i = 0; i < 200; i++) {
  const daysOffset = Math.floor(Math.random() * 180);
  const occurredAt = new Date(Date.UTC(2026, 0, 1) + daysOffset * 24 * 60 * 60 * 1000);
  events.push({
    event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
    user_id: `user_${Math.floor(Math.random() * 500)}`,
    referral_channel: channels[Math.floor(Math.random() * channels.length)],
    occurred_at: occurredAt,
  });
}

db.events.insertMany(events);
