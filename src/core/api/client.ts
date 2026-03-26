// Lightweight API helpers for same-origin frontend requests.
export async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }

  let detail = "";

  try {
    const errorData = (await response.json()) as { error?: unknown; message?: unknown };
    detail = String(errorData.message ?? errorData.error ?? "");
  } catch {
    try {
      detail = await response.text();
    } catch {
      detail = "";
    }
  }

  const suffix = detail ? ` - ${detail}` : "";
  throw new Error(`Request failed: ${response.status} ${response.statusText}${suffix}`);
}
