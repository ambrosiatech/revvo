import { createClient } from 'v0-sdk';
import fs from 'fs';
import path from 'path';

const client = createClient({ apiKey: 'v1:team_y4Kh4TwjJicIzpT6IMgYypXg:vcp_2D2ayeKpIfrUvV17tK6eR29MYeEZJDZYY0bOFtHSxEUhEcjpoX2qpb3i' });

const prompt = `Create a conversion-focused, mobile-responsive landing page for ReviewPilot — a SaaS tool that automatically sends SMS and email review requests to customers after a job, helping local service businesses (plumbers, HVAC, dentists, salons) get more Google reviews. Positioned as "Birdeye but $29/month."

Use React with Tailwind CSS only. No external UI libraries.
Colors: deep blue (#1a3a5c) primary, white background, orange (#f97316) CTA buttons.
Design feel: clean, professional, trustworthy — like Housecall Pro. Not startup-y.

Sections:
1. NAV: "ReviewPilot ⭐" logo left, "Start Free Trial" orange button right (links to #waitlist)

2. HERO: 
- H1: "More 5-Star Reviews. On Autopilot."
- Subtext: "ReviewPilot automatically texts and emails your customers after every job — so you get the reviews without the awkward ask."
- Orange CTA: "Start Free Trial →" → #waitlist
- Small text: "No credit card required · Setup in 5 minutes"

3. SOCIAL PROOF BAR (light gray bg): "Trusted by plumbers, HVAC techs, dentists & salons" with 3 stat badges: "2,400+ reviews sent this week" | "4.8★ average rating boost" | "Setup in under 5 min"

4. HOW IT WORKS (3 numbered steps):
1. Connect your Google Business Profile
2. Add a customer after each job
3. They get a text → leave a review in one tap

5. FEATURES GRID (2 cols, emoji icons): SMS + Email requests | Auto follow-up | Real-time alerts | Simple dashboard | Works for any business | Cancel anytime

6. COMPARISON TABLE:
Headers: Feature | ReviewPilot | Birdeye | Podium
Row 1: Monthly Price | $29 | $299 | $399
Row 2: Review Requests | ✓ | ✓ | ✓
Row 3: SMS + Email | ✓ | ✓ | ✓
Row 4: Simple Setup | ✓ | ✗ | ✗
Row 5: No Contract | ✓ | ✗ | ✗
Highlight the ReviewPilot column in blue.

7. TESTIMONIALS (3 cards):
- Mike T., HVAC Owner: "I went from 12 reviews to 47 in 6 weeks. My phone doesn't stop ringing."
- Sarah K., Dental Office Manager: "So simple. I add a patient, they get a text, we get a review. Done."
- Jake R., Plumber: "I was paying $300/month for Birdeye. Same results for $29. No brainer."

8. PRICING (centered card, blue border):
- $29/month, "Everything you need"
- Checklist: Unlimited review requests, SMS + email, Auto follow-up, Real-time alerts, Google Business integration, Cancel anytime
- Orange CTA: "Start 14-Day Free Trial"
- "No credit card required"

9. WAITLIST (id="waitlist", #1a3a5c bg, white text):
- H2: "Get Early Access"
- Subtext: "Be the first to know when ReviewPilot launches."
- Email input + orange "Join Waitlist" button
- On submit: fetch POST to "WAITLIST_ENDPOINT" with { email }, show success message "You're on the list! We'll be in touch."
- Handle loading state on button

10. FOOTER: "ReviewPilot © 2024" | Privacy Policy link

Export as default React component named LandingPage.`;

console.log('Calling v0 API...');
const chat = await client.chats.create({ message: prompt });

console.log('Chat ID:', chat.id);
console.log('Files generated:', chat.latestVersion?.files?.length || 0);

const files = chat.latestVersion?.files || [];
for (const file of files) {
  const filePath = path.join(process.cwd(), file.name);
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, file.content);
  console.log('Written:', file.name);
}

if (files.length === 0) {
  console.log('No files returned. Full response:');
  console.log(JSON.stringify(chat, null, 2));
}
