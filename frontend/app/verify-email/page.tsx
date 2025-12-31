"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BACKEND_URL } from "@/lib/api";

type VerifyEmailResponse = {
  status?: string;
  acknowledgement_id?: string;
  detail?: string;
};

type ViewState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "success"; data: VerifyEmailResponse };

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<ViewState>({ kind: "idle" });

  useEffect(() => {
    if (!token) return;

    const url = `${BACKEND_URL}/api/bookings/verify-email/?token=${encodeURIComponent(token)}`;

    fetch(url)
      .then(async (res) => {
        const data: VerifyEmailResponse = await res
          .json()
          .catch(() => ({ detail: "Invalid response from server." }));

        if (!res.ok) {
          throw new Error(data.detail || "Email verification failed.");
        }

        return data;
      })
      .then((data) => {
        setState({ kind: "success", data });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Email verification failed.";
        setState({ kind: "error", message });
      });
  }, [token]);

  return (
    <main className="mx-auto max-w-xl px-6 py-12">
      <h1 className="text-2xl font-title">Verify Email</h1>

      {!token && (
        <div className="mt-4">
          <p className="font-body">Verification failed.</p>
          <p className="mt-2 text-sm opacity-80">Missing token in URL.</p>
        </div>
      )}

      {token && state.kind === "idle" && <p className="mt-4">Verifying…</p>}

      {state.kind === "loading" && <p className="mt-4">Verifying…</p>}

      {state.kind === "error" && (
        <div className="mt-4">
          <p className="font-body">Verification failed.</p>
          <p className="mt-2 text-sm opacity-80">{state.message}</p>
        </div>
      )}

      {state.kind === "success" && (
        <div className="mt-4">
          <p className="font-body">Verification response:</p>
          <div className="mt-2 rounded-md border border-white/10 p-4">
            <p>
              <span className="opacity-80">Status:</span> {state.data.status ?? "—"}
            </p>
            <p className="mt-1">
              <span className="opacity-80">Acknowledgement ID:</span> {state.data.acknowledgement_id ?? "—"}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
