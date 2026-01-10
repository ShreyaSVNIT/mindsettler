import PolicyLayout from "@/components/PolicyLayout";

export default function ConfidentialityPolicy() {
  return (
    <PolicyLayout
      title="Confidentiality Policy"
      lastUpdated="December 2025"
    >
      <p>
        At MindSettler, your trust is our priority. All sessions are conducted
        with strict confidentiality and respect.
      </p>

      <h2>Confidentiality Commitment</h2>
      <p>
        Information shared during sessions remains confidential and is not
        disclosed to anyone without your consent.
      </p>

      <h2>Exceptions</h2>
      <p>
        Confidentiality may be broken only if:
      </p>
      <ul>
        <li>There is a risk of harm to you or others</li>
        <li>Disclosure is required by law</li>
      </ul>

      <h2>Session Records</h2>
      <p>
        Minimal session notes may be maintained solely for continuity of care
        and are securely stored.
      </p>

      <h2>Client Consent</h2>
      <p>
        By proceeding with the first session, you acknowledge that you have
        read, understood, and agreed to this confidentiality policy.
      </p>

      <h2>Respect & Professionalism</h2>
      <p>
        Our team is committed to treating every client with respect and professionalism. Confidentiality is a cornerstone of our practice.
      </p>
      <h2>Questions & Concerns</h2>
      <p>
        If you have any questions about confidentiality, please contact us at <a href="mailto:mindsettler.dev@gmail.com">mindsettler.dev@gmail.com</a>.
      </p>
    </PolicyLayout>
  );
}
