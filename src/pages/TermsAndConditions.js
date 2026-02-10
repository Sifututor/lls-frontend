// src/pages/TermsOfService.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/legal.css';

function TermsOfService() {
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
        <h1 className="legal-title">TERMS OF SERVICE</h1>
        <p className="legal-subtitle">Learnest Learning System (LLS)</p>
        <p className="legal-date">Effective Date: January 2026  |  Last Updated: January 26, 2026</p>

        {/* Section 1 */}
        <section className="legal-section">
          <h2>1. Agreement to Terms</h2>
          <p>
            These Terms of Service ("Terms" or "Agreement") constitute a legally binding agreement between you and Sifu Edu & Learning Sdn Bhd (Company Registration No. 1270698W / 201801008684), operating under the brand Sifututor ("Company", "we", "us", or "our"), governing your access to and use of the Learnest Learning System ("LLS" or the "Platform"), including all associated services, features, content, and applications.
          </p>
          <p>
            BY CREATING AN ACCOUNT, ACCESSING, OR USING THE PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND OUR PRIVACY POLICY. If you do not agree to these Terms, you must not access or use the Platform.
          </p>
          <p>
            Company Address: No. 1-1F, Jalan Setia Perdana BE U13/BE, Bandar Setia Alam, Seksyen U13, Shah Alam, Selangor 40170, Malaysia
          </p>
        </section>

        {/* Section 2 */}
        <section className="legal-section">
          <h2>2. Description of Services</h2>
          <p>
            LLS is an online educational platform designed primarily for Malaysian secondary school students (Form 1-5). The Platform provides:
          </p>
          <ul>
            <li>Video-based educational courses aligned with the Malaysian curriculum</li>
            <li>Auto-graded quizzes and assessments</li>
            <li>AI-powered tutoring assistance</li>
            <li>Community-based Video Q&A discussions</li>
            <li>Live class sessions with tutors</li>
            <li>Learning progress tracking and analytics</li>
            <li>Related educational features and tools</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="legal-section">
          <h2>3. User Accounts and Registration</h2>
          
          <h3>3.1 Account Creation</h3>
          <p>To access certain features of the Platform, you must create an account by providing accurate, complete, and current information during registration. You agree to:</p>
          <ul>
            <li>Provide truthful and accurate registration information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security and confidentiality of your login credentials</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>

          <h3>3.2 Age Requirements</h3>
          <p>LLS is intended for users 13 years of age and older. By registering, you represent and warrant that:</p>
          <ul>
            <li>You are at least 18 years of age; OR</li>
            <li>If you are between 13 and 17 years of age, you have obtained verifiable consent from a parent or legal guardian to use the Platform</li>
            <li>You are not prohibited from receiving services under the laws of Malaysia or any other applicable jurisdiction</li>
          </ul>
          <p>
            Parents and guardians who consent to their child's use of the Platform assume full responsibility for ensuring their child's compliance with these Terms.
          </p>

          <h3>3.3 Account Types</h3>
          <p>The Platform supports the following user roles:</p>
          <ul>
            <li><strong>Students:</strong> Primary users who access educational content, take quizzes, and participate in learning activities</li>
            <li><strong>Tutors:</strong> Educators who create and upload content, answer questions, and conduct live classes</li>
            <li><strong>Administrators:</strong> Authorized personnel who manage the Platform and its users</li>
            <li><strong>Parents:</strong> Individuals with read-only access to monitor their child's learning progress via a unique access link</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="legal-section">
          <h2>4. Subscription and Payment Terms</h2>
          
          <h3>4.1 Service Tiers</h3>
          <p>LLS offers the following service tiers:</p>

          {/* Pricing Table */}
          <div className="pricing-table">
            <div className="pricing-column free">
              <div className="pricing-header">Free Tier</div>
              <div className="pricing-body">
                <ul>
                  <li>• Unlimited video courses</li>
                  <li>• 1080p video quality</li>
                  <li>• Auto-graded quizzes (3 attempts/quiz/day)</li>
                  <li>• Browse Video Q&A discussions</li>
                  <li>• AI Tutor (5 questions/day)</li>
                  <li>• Progress tracking and badges</li>
                </ul>
              </div>
            </div>
            <div className="pricing-column premium">
              <div className="pricing-header">Premium Tier (RM 9.90/month)</div>
              <div className="pricing-body">
                <ul>
                  <li>• All Free Tier features, PLUS:</li>
                  <li>• Join live classes</li>
                  <li>• Post Video Q&A questions (unlimited)</li>
                  <li>• Unlimited AI Tutor questions</li>
                  <li>• Video speed control (0.5x - 2x)</li>
                  <li>• Bookmarks with notes</li>
                  <li>• Download supplementary materials</li>
                  <li>• All live class recordings</li>
                </ul>
              </div>
            </div>
          </div>

          <h3>4.2 Sifututor Students</h3>
          <p>
            Students with active Sifututor subscriptions receive Premium tier access at no additional charge as part of their existing Sifututor subscription benefits. Premium access for Sifututor students is automatically activated upon registration and is contingent on maintaining an active Sifututor subscription.
          </p>

          <h3>4.3 Payment Processing</h3>
          <p>For direct Premium subscriptions, payments are processed through our authorized third-party payment gateway providers. You agree to:</p>
          <ul>
            <li>Provide valid and current payment information</li>
            <li>Authorize us to charge the applicable subscription fees</li>
            <li>Accept automatic renewal of your subscription unless cancelled prior to the renewal date</li>
          </ul>

          <h3>4.4 Automatic Renewal</h3>
          <p>
            Premium subscriptions automatically renew on a monthly basis at the then-current subscription rate unless you cancel before the next billing date. You may cancel your subscription at any time through your account settings. Cancellation takes effect at the end of your current billing period.
          </p>

          <h3>4.5 No Refunds</h3>
          <p>ALL SUBSCRIPTION FEES ARE NON-REFUNDABLE. Once payment has been processed, no refunds will be issued for any reason, including but not limited to:</p>
          <ul>
            <li>Partial use of the subscription period</li>
            <li>Early cancellation of your subscription</li>
            <li>Dissatisfaction with the service</li>
            <li>Technical issues or service unavailability</li>
            <li>Account suspension or termination due to violation of these Terms</li>
            <li>Failure to use the Platform</li>
          </ul>
          <p>
            We reserve the right to issue refunds or credits at our sole discretion in exceptional circumstances.
          </p>

          <h3>4.6 Price Changes</h3>
          <p>
            We reserve the right to modify subscription pricing at any time. Price changes will be communicated to you at least 30 days before taking effect. Continued use of the Platform after a price change constitutes acceptance of the new pricing.
          </p>
        </section>

        {/* Section 5 */}
        <section className="legal-section">
          <h2>5. License and Permitted Use</h2>
          
          <h3>5.1 License Grant</h3>
          <p>
            Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for your personal, non-commercial educational purposes.
          </p>

          <h3>5.2 License Restrictions</h3>
          <p>You may NOT:</p>
          <ul>
            <li>Copy, reproduce, distribute, or publicly display any Platform content without authorization</li>
            <li>Download, record, or capture video content through any means</li>
            <li>Modify, adapt, translate, or create derivative works from Platform content</li>
            <li>Sell, license, rent, lease, or commercially exploit the Platform or its content</li>
            <li>Share, transfer, or sublicense your account or access to others</li>
            <li>Use automated tools, bots, or scraping technologies to access the Platform</li>
            <li>Reverse engineer, decompile, or disassemble any Platform software</li>
            <li>Remove or alter any copyright, trademark, or proprietary notices</li>
            <li>Use the Platform for any commercial or unauthorized purpose</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="legal-section">
          <h2>6. Intellectual Property Rights</h2>
          
          <h3>6.1 Platform Ownership</h3>
          <p>
            The Platform and all its components, including but not limited to software, code, design, graphics, user interface, videos, educational content, quizzes, trademarks, logos, and all other intellectual property, are owned by or licensed to Sifu Edu & Learning Sdn Bhd and are protected by copyright, trademark, and other intellectual property laws of Malaysia and international treaties.
          </p>

          <h3>6.2 Educational Content</h3>
          <p>
            All educational content on the Platform, including video lessons, quizzes, supplementary materials, and AI Tutor responses, is the exclusive property of the Company and its content creators. This content is licensed solely for your personal educational use within the Platform.
          </p>

          <h3>6.3 User-Generated Content</h3>
          <p>By posting questions, answers, comments, or other content on the Platform ("User Content"), you:</p>
          <ul>
            <li>Retain ownership of your original User Content</li>
            <li>Grant us a worldwide, non-exclusive, royalty-free, perpetual license to use, reproduce, modify, display, and distribute your User Content in connection with the Platform</li>
            <li>Represent that your User Content does not violate any third-party rights</li>
            <li>Acknowledge that User Content may remain on the Platform in anonymized form even after account deletion</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="legal-section">
          <h2>7. Prohibited Conduct</h2>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          
          <h3>7.1 General Prohibitions</h3>
          <ul>
            <li>Violate any applicable laws, regulations, or these Terms</li>
            <li>Impersonate any person or entity or misrepresent your affiliation</li>
            <li>Post false, misleading, defamatory, or fraudulent content</li>
            <li>Harass, bully, threaten, or abuse other users</li>
            <li>Post content that is obscene, offensive, or inappropriate for an educational environment</li>
            <li>Share personal information of others without their consent</li>
            <li>Use the Platform for any commercial purposes without authorization</li>
            <li>Interfere with or disrupt the Platform or servers</li>
          </ul>
          
          <h3>7.2 Security Violations</h3>
          <ul>
            <li>Attempt to gain unauthorized access to the Platform, user accounts, or computer systems</li>
            <li>Transmit viruses, malware, or any destructive code</li>
            <li>Circumvent or attempt to circumvent security measures or access controls</li>
            <li>Use any automated means to access or collect data from the Platform</li>
            <li>Probe, scan, or test the vulnerability of the Platform without authorization</li>
          </ul>
          
          <h3>7.3 Academic Integrity</h3>
          <ul>
            <li>Share quiz answers or solutions with other users</li>
            <li>Use external tools or services to complete assessments dishonestly</li>
            <li>Allow others to access quizzes or assessments using your account</li>
            <li>Plagiarize content in Video Q&A submissions</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="legal-section">
          <h2>8. Termination</h2>
          
          <h3>8.1 Termination by You</h3>
          <p>You may terminate your account at any time by using the "Delete My Account" feature in your account settings. Upon termination:</p>
          <ul>
            <li>Your access to the Platform will be immediately revoked</li>
            <li>Your data will be handled in accordance with our Privacy Policy</li>
            <li>No refunds will be provided for any unused subscription period</li>
            <li>You may download your data before deletion through the "Download My Data" feature</li>
          </ul>

          <h3>8.2 Termination by Us</h3>
          <p>We reserve the right to suspend or terminate your account and access to the Platform at any time, with or without notice, for any reason, including but not limited to:</p>
          <ul>
            <li>Violation of these Terms or any applicable laws</li>
            <li>Conduct that is harmful to other users, the Company, or third parties</li>
            <li>Non-payment of subscription fees</li>
            <li>Extended period of inactivity</li>
            <li>Requests by law enforcement or government agencies</li>
            <li>Our decision to discontinue the Platform or any part of it</li>
          </ul>

          <h3>8.3 Effect of Termination</h3>
          <p>
            Upon termination, all rights granted to you under these Terms will immediately cease. Sections of these Terms that by their nature should survive termination shall survive, including but not limited to intellectual property provisions, disclaimers, limitations of liability, and dispute resolution.
          </p>
        </section>

        {/* Section 9 */}
        <section className="legal-section">
          <h2>9. Disclaimers</h2>
          
          <h3>9.1 "As Is" Basis</h3>
          <p>
            THE PLATFORM AND ALL CONTENT, SERVICES, AND FEATURES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. To the fullest extent permitted by law, we disclaim all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, non-infringement, and accuracy.
          </p>

          <h3>9.2 Educational Content</h3>
          <p>
            The educational content provided on the Platform is intended for general learning purposes and should not be considered a substitute for formal education, professional advice, or official examination preparation. We do not guarantee that use of the Platform will result in specific educational outcomes, grades, or examination results.
          </p>

          <h3>9.3 AI Tutor</h3>
          <p>
            The AI Tutor feature uses artificial intelligence technology to provide educational assistance. While we strive for accuracy, AI-generated responses may occasionally contain errors or inaccuracies. Users should verify important information and exercise independent judgment.
          </p>

          <h3>9.4 Service Availability</h3>
          <p>
            We do not guarantee uninterrupted, timely, secure, or error-free access to the Platform. The Platform may be unavailable due to maintenance, updates, or circumstances beyond our control.
          </p>
        </section>

        {/* Section 10 */}
        <section className="legal-section">
          <h2>10. Limitation of Liability</h2>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:</p>
          <ul>
            <li><strong>NO LIABILITY FOR INDIRECT DAMAGES:</strong> In no event shall Sifu Edu & Learning Sdn Bhd, its directors, officers, employees, agents, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses, arising out of or related to your use of the Platform.</li>
            <li><strong>CAP ON LIABILITY:</strong> Our total aggregate liability for any claims arising from or related to these Terms or your use of the Platform shall not exceed the total amount you paid to us in subscription fees during the twelve (12) months preceding the claim, or RM 100.00, whichever is greater.</li>
            <li><strong>ESSENTIAL BASIS:</strong> You acknowledge that the limitations of liability in this section are an essential element of the bargain between you and us, and form the basis for our ability to provide the Platform at the current pricing.</li>
          </ul>
        </section>

        {/* Section 11 */}
        <section className="legal-section">
          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Sifu Edu & Learning Sdn Bhd, its directors, officers, employees, agents, and affiliates from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from: (a) your use of the Platform; (b) your violation of these Terms; (c) your violation of any third-party rights, including intellectual property rights; or (d) your User Content.
          </p>
        </section>

        {/* Section 12 */}
        <section className="legal-section">
          <h2>12. Governing Law and Dispute Resolution</h2>
          
          <h3>12.1 Governing Law</h3>
          <p>
            These Terms and any disputes arising out of or related to these Terms or the Platform shall be governed by and construed in accordance with the laws of Malaysia, without regard to its conflict of law principles.
          </p>

          <h3>12.2 Dispute Resolution</h3>
          <p>In the event of any dispute, claim, or controversy arising out of or relating to these Terms or your use of the Platform:</p>
          <ul>
            <li><strong>Informal Resolution:</strong> You agree to first attempt to resolve the dispute informally by contacting us at support@learnest.com. We will attempt to resolve the dispute through good faith negotiations within thirty (30) days.</li>
            <li><strong>Mediation:</strong> If informal resolution fails, the parties agree to attempt to resolve the dispute through mediation administered by the Asian International Arbitration Centre (AIAC) before pursuing other legal remedies.</li>
            <li><strong>Jurisdiction:</strong> If mediation is unsuccessful, any legal action shall be filed exclusively in the courts of Malaysia, and you consent to the personal jurisdiction of such courts.</li>
          </ul>

          <h3>12.3 Class Action Waiver</h3>
          <p>
            You agree that any dispute resolution proceedings will be conducted only on an individual basis and not as a class, consolidated, or representative action.
          </p>
        </section>

        {/* Section 13 */}
        <section className="legal-section">
          <h2>13. General Provisions</h2>
          
          <h3>13.1 Entire Agreement</h3>
          <p>
            These Terms, together with the Privacy Policy and any other legal notices published on the Platform, constitute the entire agreement between you and the Company regarding your use of the Platform and supersede all prior agreements and understandings.
          </p>

          <h3>13.2 Severability</h3>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary so that these Terms shall otherwise remain in full force and effect.
          </p>

          <h3>13.3 Waiver</h3>
          <p>
            Our failure to enforce any right or provision of these Terms shall not be deemed a waiver of such right or provision. Any waiver of any provision of these Terms will be effective only if in writing and signed by an authorized representative of the Company.
          </p>

          <h3>13.4 Assignment</h3>
          <p>
            You may not assign or transfer these Terms or your rights and obligations hereunder without our prior written consent. We may assign or transfer these Terms without restriction.
          </p>

          <h3>13.5 Force Majeure</h3>
          <p>
            We shall not be liable for any failure or delay in performing our obligations under these Terms where such failure or delay results from circumstances beyond our reasonable control, including but not limited to natural disasters, war, terrorism, riots, government actions, internet outages, or pandemics.
          </p>

          <h3>13.6 Notices</h3>
          <p>
            We may provide notices to you by posting on the Platform, sending to your registered email address, or any other method we deem appropriate. You agree to keep your email address current and to regularly check the Platform for notices.
          </p>
        </section>

        {/* Section 14 */}
        <section className="legal-section">
          <h2>14. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. We will notify you of material changes by:</p>
          <ul>
            <li>Posting the updated Terms on the Platform</li>
            <li>Sending a notification to your registered email address</li>
            <li>Displaying a prominent notice on the Platform</li>
            <li>Updating the "Last Updated" date at the top of these Terms</li>
          </ul>
          <p>
            Your continued use of the Platform after any changes constitutes acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using the Platform.
          </p>
        </section>

        {/* Section 15 */}
        <section className="legal-section">
          <h2>15. Contact Information</h2>
          <p>For questions or concerns regarding these Terms of Service:</p>
          <div className="contact-info">
            <p><strong>Company Name:</strong> Sifu Edu & Learning Sdn Bhd</p>
            <p><strong>Registration No.:</strong> 1270698W (201801008684)</p>
            <p><strong>Address:</strong> No. 1-1F, Jalan Setia Perdana BE U13/BE, Bandar Setia Alam, Seksyen U13, Shah Alam, Selangor 40170, Malaysia</p>
            <p><strong>Email:</strong> <a href="mailto:legal@learnest.com">legal@learnest.com</a></p>
            <p><strong>Support:</strong> <a href="mailto:support@learnest.com">support@learnest.com</a></p>
          </div>
        </section>

      </div>
    </div>
  );
}

export default TermsOfService;