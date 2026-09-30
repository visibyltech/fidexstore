// Server-side check of a Klump transaction. Used by the verify endpoint and
// by POST /api/orders, so an order paid with Klump is only recorded once
// Klump itself confirms the payment (not just the browser saying so).

export type KlumpVerification =
  | { ok: true; amount: number | null; raw: unknown }
  | { ok: false; status: number; error: string; raw?: unknown };

export async function verifyKlumpTransaction(reference: string): Promise<KlumpVerification> {
  const secretKey = process.env.KLUMP_SECRET_KEY;
  if (!secretKey) {
    return { ok: false, status: 500, error: "Klump is not configured on the server" };
  }

  const response = await fetch(
    `https://api.useklump.com/v1/transactions/${encodeURIComponent(reference)}/verify`,
    { headers: { "Content-Type": "application/json", "klump-secret-key": secretKey } }
  );
  const raw = await response.json().catch(() => null);

  if (!response.ok || raw?.data?.status !== "successful") {
    return { ok: false, status: response.ok ? 402 : response.status, error: "Klump payment was not confirmed", raw };
  }

  const amount = Number(raw.data.amount);
  return { ok: true, amount: Number.isFinite(amount) ? amount : null, raw };
}
