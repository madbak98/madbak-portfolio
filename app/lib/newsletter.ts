export type SubscribeResult = { ok: true } | { ok: false; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | null {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "That email address doesn’t look right.";
  return null;
}

/**
 * Newsletter subscription entry point.
 * There is no newsletter provider yet: this resolves locally so the UI can
 * show its success state. Replace the body with a provider / route handler call.
 */
export async function submitSubscription(email: string): Promise<SubscribeResult> {
  const error = validateEmail(email);
  if (error) return { ok: false, message: error };
  await new Promise((resolve) => setTimeout(resolve, 650));
  return { ok: true };
}
