export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-[#1a3a5c] mb-2">Privacy Policy</h1>
      <p className="text-gray-500 mb-8">Last updated: January 1, 2024</p>

      <section className="space-y-6 text-gray-700">
        <div>
          <h2 className="text-xl font-semibold text-[#1a3a5c] mb-2">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, including your name, email address, and business information when you sign up for ReviewPilot. We also collect customer contact information (name, phone number, email) that you enter to send review requests.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#1a3a5c] mb-2">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, send review request messages on your behalf to your customers, send you service-related emails and updates, and respond to your comments and questions.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#1a3a5c] mb-2">3. SMS and Email Communications</h2>
          <p>By using ReviewPilot, you confirm that you have obtained appropriate consent from your customers to receive SMS and email communications from your business. You are responsible for ensuring compliance with applicable laws including the TCPA, CAN-SPAM Act, and other relevant regulations.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#1a3a5c] mb-2">4. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating our platform (such as SMS and email delivery providers), subject to confidentiality agreements.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#1a3a5c] mb-2">5. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#1a3a5c] mb-2">6. Data Retention</h2>
          <p>We retain your information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time by contacting us.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#1a3a5c] mb-2">7. Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, please contact us at privacy@reviewpilot.app.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#1a3a5c] mb-2">8. Cookies</h2>
          <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#1a3a5c] mb-2">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#1a3a5c] mb-2">10. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:privacy@reviewpilot.app" className="text-[#f97316] underline">privacy@reviewpilot.app</a></p>
        </div>
      </section>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <a href="/" className="text-[#f97316] hover:underline">← Back to ReviewPilot</a>
      </div>
    </main>
  )
}
