"use client";

import ContactOverlay from '@/components/ContactOverlay';

export default function ContactPage() {
  // Render the ContactOverlay with the overlay opened so the route acts
  // like a dedicated contact page while reusing the existing component.
  return (
    <main>
      <ContactOverlay initialOpen />
    </main>
  );
}
