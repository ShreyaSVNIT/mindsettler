import PolicyLayout from "@/components/PolicyLayout";

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="December 2025">
      <p>
        MindSettler respects your privacy and is committed to protecting your
        personal information. This Privacy Policy explains how we collect, use,
        and safeguard your data.
      </p>

      <h2>Information We Collect</h2>
      <ul>
        <li>Name, age, and contact details</li>
        <li>Session booking details</li>
        <li>Information shared during sessions</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To schedule and conduct sessions</li>
        <li>To communicate session-related updates</li>
        <li>To improve our services</li>
      </ul>

      <h2>Data Protection</h2>
      <p>
        We take reasonable measures to protect your information from
        unauthorized access, disclosure, or misuse.
      </p>

      <h2>Third-Party Sharing</h2>
      <p>
        We do not sell or share your personal data with third parties, except
        where required by law.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may request access, correction, or deletion of your personal data by
        contacting us.
      </p>

      <h2>Contact</h2>
      <p>
        For any privacy-related concerns, please contact MindSettler via the
        details provided on our Contact page.
      </p>
    </PolicyLayout>
  );
}
