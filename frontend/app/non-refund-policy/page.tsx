import PolicyLayout from "@/components/PolicyLayout";

export default function NonRefundPolicy() {
  return (
    <PolicyLayout title="Non-Refund Policy" lastUpdated="December 2025">
      <p>
        MindSettler follows a strict non-refund policy for all booked sessions.
      </p>

      <h2>Session Payments</h2>
      <p>
        Once a session is booked and payment is made (via UPI or cash), the
        amount is non-refundable.
      </p>

      <h2>Missed or Cancelled Sessions</h2>
      <p>
        Missed sessions or cancellations made after confirmation are not
        eligible for refunds, as time is reserved specifically for you.
      </p>

      <h2>Rescheduling</h2>
      <p>
        Rescheduling may be allowed at the discretion of MindSettler if
        communicated in advance.
      </p>

      <h2>Exceptional Circumstances</h2>
      <p>
        Any exceptions are solely at the discretion of MindSettler and will be
        evaluated on a case-by-case basis.
      </p>
    </PolicyLayout>
  );
}
