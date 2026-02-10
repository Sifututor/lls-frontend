// src/pages/PrivacyPolicy.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/legal.css';

function PrivacyPolicy() {
  return (
    <div className="legal-page">
      {/* Green Header with Logo */}
      <div className="legal-header">
        <Link to="/" className="legal-logo">
          <img src="/assets/images/landingpage-logo.png" alt="Learnest" />
       
        </Link>
      </div>

      {/* White Content Container */}
      <div className="legal-content">
        <h1 className="legal-title">PRIVACY POLICY</h1>
        <p className="legal-subtitle">Learnest Learning System (LLS)</p>
        <p className="legal-date">Effective Date: January 2026  |  Last Updated: January 26, 2026</p>

        {/* Section 1 */}
        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Sifu Edu & Learning Sdn Bhd (Company Registration No. 1270698W / 201801008684), operating under the brand Sifututor, is committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the Learnest Learning System ("LLS" or the "Platform").
          </p>
          <p>
            This Privacy Policy complies with the Personal Data Protection Act 2010 (PDPA) of Malaysia and its subsequent amendments. By accessing or using LLS, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
          </p>
          <p>
            Company Address: No. 1-1F, Jalan Setia Perdana BE U13/BE, Bandar Setia Alam, Seksyen U13, Shah Alam, Selangor 40170, Malaysia
          </p>
        </section>

        {/* Section 2 */}
        <section className="legal-section">
          <h2>2. Data We Collect</h2>
          <p>We collect the following categories of personal data:</p>

          <h3>2.1 Personal Information</h3>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Password (stored in encrypted/hashed format)</li>
            <li>Profile picture (optional)</li>
            <li>Timezone preferences</li>
            <li>User role (Student, Tutor, or Administrator)</li>
          </ul>

          <h3>2.2 Learning and Activity Data</h3>
          <ul>
            <li>Course enrollments and progress</li>
            <li>Video watch history and completion status</li>
            <li>Quiz attempts, scores, and performance analytics</li>
            <li>AI Tutor conversation logs and questions asked</li>
            <li>Video Q&A questions, answers, and community interactions</li>
            <li>Video bookmarks and personal notes</li>
            <li>Live class attendance and participation records</li>
            <li>Badges and achievements earned</li>
            <li>Learning time and session duration</li>
          </ul>

          <h3>2.3 Payment and Subscription Data</h3>
          <ul>
            <li>Subscription status (Free or Premium)</li>
            <li>Payment transaction history</li>
            <li>Billing dates and payment method type</li>
            <li>Sifututor student verification status (if applicable)</li>
          </ul>
          <p>
            Note: We do not store credit card numbers or complete payment details. All payment processing is handled securely by our third-party payment gateway providers.
          </p>

          <h3>2.4 Technical and Device Data</h3>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device type and operating system</li>
            <li>Access timestamps and session information</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="legal-section">
          <h2>3. How We Use Your Data</h2>
          <p>We process your personal data for the following purposes:</p>

          <h3>3.1 Service Delivery</h3>
          <ul>
            <li>To create and manage your user account</li>
            <li>To provide access to educational content, courses, and learning materials</li>
            <li>To track your learning progress and provide personalized recommendations</li>
            <li>To enable AI-powered tutoring assistance</li>
            <li>To facilitate Video Q&A community discussions</li>
            <li>To enable live class participation and scheduling</li>
          </ul>

          <h3>3.2 Subscription and Payment Processing</h3>
          <ul>
            <li>To process Premium subscription payments</li>
            <li>To verify Sifututor student status for automatic Premium activation</li>
            <li>To manage billing, invoicing, and subscription renewals</li>
            <li>To enforce access controls based on subscription tier</li>
          </ul>

          <h3>3.3 Communication</h3>
          <ul>
            <li>To send essential service notifications (account updates, password resets, security alerts)</li>
            <li>To notify you of live class schedules and reminders</li>
            <li>To inform tutors of Video Q&A questions requiring responses</li>
            <li>To send payment confirmations and billing notifications</li>
            <li>To respond to your inquiries and support requests</li>
          </ul>

          <h3>3.4 Platform Improvement</h3>
          <ul>
            <li>To analyze usage patterns and improve our services</li>
            <li>To identify content areas requiring additional educational resources</li>
            <li>To enhance AI Tutor capabilities and response quality</li>
            <li>To develop new features based on user behavior analytics</li>
          </ul>

          <h3>3.5 Security and Compliance</h3>
          <ul>
            <li>To protect against unauthorized access, fraud, and abuse</li>
            <li>To enforce our Terms of Service</li>
            <li>To comply with legal obligations and regulatory requirements</li>
            <li>To maintain audit logs for accountability purposes</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="legal-section">
          <h2>4. Legal Basis for Processing</h2>
          <p>Under the PDPA 2010, we process your personal data based on the following legal grounds:</p>
          <ul>
            <li><strong>Consent:</strong> You provide explicit consent when registering for an account and agreeing to this Privacy Policy</li>
            <li><strong>Contractual Necessity:</strong> Processing is necessary to fulfill our service agreement with you</li>
            <li><strong>Legal Obligation:</strong> Processing is required to comply with Malaysian laws and regulations</li>
            <li><strong>Legitimate Interest:</strong> Processing is necessary for our legitimate business interests, such as improving the Platform and ensuring security, where such interests do not override your fundamental rights</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="legal-section">
          <h2>5. Data Sharing and Third Parties</h2>
          <p>We share your personal data with the following categories of third parties:</p>

          <h3>5.1 Service Providers</h3>
          
          {/* Data Sharing Table */}
          <div className="data-table">
            <div className="data-table-header">
              <div className="data-col">Provider Type</div>
              <div className="data-col">Purpose</div>
              <div className="data-col">Data Shared</div>
            </div>
            <div className="data-table-row">
              <div className="data-col">AI Services (OpenAI)</div>
              <div className="data-col">AI Tutor functionality</div>
              <div className="data-col">Questions asked to AI (without personally identifiable information)</div>
            </div>
            <div className="data-table-row">
              <div className="data-col">Payment Gateway (Stripe/Billplz)</div>
              <div className="data-col">Payment processing for Premium subscriptions</div>
              <div className="data-col">Name, email, payment details</div>
            </div>
            <div className="data-table-row">
              <div className="data-col">Video Conferencing (Zoom/Google Meet)</div>
              <div className="data-col">Live class sessions</div>
              <div className="data-col">Name, email (for meeting access)</div>
            </div>
            <div className="data-table-row">
              <div className="data-col">Cloud Storage (AWS S3)</div>
              <div className="data-col">Video content and file storage</div>
              <div className="data-col">Uploaded content, profile pictures</div>
            </div>
            <div className="data-table-row">
              <div className="data-col">CDN (Bunny CDN)</div>
              <div className="data-col">Fast video content delivery</div>
              <div className="data-col">IP address, access patterns</div>
            </div>
            <div className="data-table-row">
              <div className="data-col">Email Service (AWS SES)</div>
              <div className="data-col">Transactional and notification emails</div>
              <div className="data-col">Name, email address</div>
            </div>
          </div>

          <h3>5.2 Sifututor Integration</h3>
          <p>
            If you are a Sifututor student, we verify your subscription status through secure API communication with the Sifututor Integrated Management System (SIMS) to provide automatic Premium access. This verification involves sharing your email address with SIMS to confirm your active subscription status.
          </p>

          <h3>5.3 Legal Disclosures</h3>
          <p>
            We may disclose your personal data if required by law, court order, or government regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
          </p>
        </section>

        {/* Section 6 */}
        <section className="legal-section">
          <h2>6. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal data:</p>
          <ul>
            <li><strong>Encryption:</strong> All data transmitted between your device and our servers is encrypted using SSL/TLS protocols. Passwords are stored using industry-standard hashing algorithms.</li>
            <li><strong>Access Controls:</strong> Role-based access ensures that only authorized personnel can access personal data, with the principle of least privilege applied.</li>
            <li><strong>Authentication:</strong> Token-based authentication with automatic session expiration protects account access.</li>
            <li><strong>Infrastructure Security:</strong> Our cloud infrastructure is hosted in secure data centers with physical and network security measures.</li>
            <li><strong>Regular Audits:</strong> We conduct periodic security assessments and vulnerability testing.</li>
            <li><strong>Incident Response:</strong> We maintain procedures for detecting, reporting, and responding to data security incidents.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="legal-section">
          <h2>7. Data Retention</h2>
          <p>We retain your personal data in accordance with the following policy:</p>

          <h3>7.1 Active Accounts</h3>
          <p>
            While your account remains active, we retain all data necessary to provide our services and maintain your learning history.
          </p>

          <h3>7.2 Account Deletion</h3>
          <ul>
            <li><strong>Grace Period:</strong> Upon account deletion request, your data is soft-deleted and retained for 30 days to allow recovery if requested.</li>
            <li><strong>Permanent Deletion:</strong> After 30 days, personal identifiers are permanently deleted from our systems.</li>
            <li><strong>Community Content:</strong> Video Q&A questions and answers you posted are anonymized (displayed as "Deleted User") rather than deleted, to preserve community learning value.</li>
          </ul>

          <h3>7.3 Exceptions</h3>
          <ul>
            <li><strong>Payment Records:</strong> Transaction records are retained for 7 years as required by Malaysian tax law.</li>
            <li><strong>Legal Obligations:</strong> Data may be retained longer if required by law, court order, or ongoing legal proceedings.</li>
            <li><strong>Anonymized Analytics:</strong> Aggregated, anonymized data without personal identifiers may be retained indefinitely for platform improvement purposes.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="legal-section">
          <h2>8. Your Rights Under PDPA</h2>
          <p>Under the Personal Data Protection Act 2010 and its amendments, you have the following rights:</p>

          <h3>8.1 Right of Access</h3>
          <p>
            You have the right to request access to your personal data that we hold. You can download a copy of your data directly through the Platform using the "Download My Data" feature in your account settings.
          </p>

          <h3>8.2 Right of Correction</h3>
          <p>
            You have the right to request correction of any inaccurate or incomplete personal data. You can update most information directly through your profile settings, or contact us for assistance with other corrections.
          </p>

          <h3>8.3 Right of Erasure</h3>
          <p>
            You have the right to request deletion of your personal data. You can initiate account deletion through the "Delete My Account" feature in your account settings. Note that certain data may be retained as described in Section 7.3.
          </p>

          <h3>8.4 Right of Data Portability</h3>
          <p>
            You have the right to receive your personal data in a structured, commonly used, and machine-readable format (JSON or CSV) through the "Download My Data" feature.
          </p>

          <h3>8.5 Right to Withdraw Consent</h3>
          <p>
            Where we rely on your consent for data processing, you have the right to withdraw that consent at any time. You can adjust your notification preferences or delete your account to exercise this right. Note that withdrawal of consent may affect your ability to use certain features of the Platform.
          </p>

          <h3>8.6 How to Exercise Your Rights</h3>
          <p>
            To exercise any of these rights, you may use the self-service features in your account settings or contact our Data Protection Officer at the contact details provided in Section 13. We will respond to your request within 21 days as required by the PDPA.
          </p>
        </section>

        {/* Section 9 */}
        <section className="legal-section">
          <h2>9. Children's Privacy</h2>
          <p>
            LLS is designed for Malaysian secondary school students (Form 1-5), which includes users who may be under 18 years of age.
          </p>
          <ul>
            <li><strong>Parental Consent:</strong> By registering for an account, users confirm that they are 18 years or older, OR that they have obtained parent or guardian consent to use the Platform.</li>
            <li><strong>Parent Access:</strong> Students can generate a read-only access link for their parents/guardians to monitor their learning progress.</li>
            <li><strong>Sifututor Students:</strong> For students registered through Sifututor, parental consent is established through the existing Sifututor enrollment agreement.</li>
            <li><strong>Data Minimization:</strong> We collect only the minimum data necessary to provide educational services to minors.</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="legal-section">
          <h2>10. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar technologies to enhance your experience on the Platform:</p>

          <h3>10.1 Essential Cookies</h3>
          <p>
            Required for authentication, security, and basic functionality. These cookies cannot be disabled as they are necessary for the Platform to function.
          </p>

          <h3>10.2 Analytics Cookies</h3>
          <p>
            Used to understand how users interact with the Platform and to improve our services. You can opt out of analytics cookies through the cookie consent banner.
          </p>

          <h3>10.3 Managing Cookies</h3>
          <p>
            You can manage your cookie preferences through the cookie settings link in the Platform footer, or through your browser settings. Note that disabling essential cookies may affect Platform functionality.
          </p>
        </section>

        {/* Section 11 */}
        <section className="legal-section">
          <h2>11. International Data Transfers</h2>
          <p>
            Some of our third-party service providers operate outside of Malaysia. When your data is transferred internationally, we ensure appropriate safeguards are in place:
          </p>
          <ul>
            <li>Transfers are made to countries with adequate data protection standards</li>
            <li>Standard contractual clauses are used where required</li>
            <li>Service providers are bound by data processing agreements</li>
            <li>Technical and organizational security measures are maintained</li>
          </ul>
        </section>

        {/* Section 12 */}
        <section className="legal-section">
          <h2>12. Data Breach Notification</h2>
          <p>In accordance with PDPA requirements, in the event of a personal data breach that poses a risk to your rights and freedoms:</p>
          <ul>
            <li>We will notify the Personal Data Protection Commissioner within 72 hours of becoming aware of the breach</li>
            <li>We will notify affected individuals within 7 days where the breach is likely to result in significant harm</li>
            <li>Notification will include the nature of the breach, data affected, and steps taken to mitigate harm</li>
          </ul>
        </section>

        {/* Section 13 - Contact Information */}
        <section className="legal-section">
          <h2>13. Contact Information</h2>
          <p>For questions, concerns, or requests regarding this Privacy Policy or your personal data:</p>
          <div className="contact-info">
            <p><strong>Company Name:</strong> Sifu Edu & Learning Sdn Bhd</p>
            <p><strong>Registration No.:</strong> 1270698W (201801008684)</p>
            <p><strong>Address:</strong> No. 1-1F, Jalan Setia Perdana BE U13/BE, Bandar Setia Alam, Seksyen U13, Shah Alam, Selangor 40170, Malaysia</p>
            <p><strong>Data Protection Email:</strong> <a href="mailto:privacy@learnest.com">privacy@learnest.com</a></p>
            <p><strong>General Support:</strong> <a href="mailto:support@learnest.com">support@learnest.com</a></p>
          </div>
        </section>

        {/* Section 14 */}
        <section className="legal-section">
          <h2>14. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors.</p>
          <ul>
            <li>Material changes will be notified to you via email or prominent notice on the Platform</li>
            <li>The "Last Updated" date at the top indicates when revisions were made</li>
            <li>Continued use of the Platform after changes constitutes acceptance of the updated policy</li>
            <li>You may access previous versions of this policy by contacting us</li>
          </ul>
        </section>

        {/* Section 15 */}
        <section className="legal-section">
          <h2>15. Governing Law</h2>
          <p>
            This Privacy Policy is governed by and construed in accordance with the laws of Malaysia, including the Personal Data Protection Act 2010 and its amendments. Any disputes arising from this Privacy Policy shall be subject to the exclusive jurisdiction of the courts of Malaysia.
          </p>
        </section>

      </div>
    </div>
  );
}

export default PrivacyPolicy;