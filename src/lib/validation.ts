export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateInstagramUrl(url: string): { valid: boolean; error?: string } {
  if (!url || typeof url !== "string") {
    return { valid: false, error: "URL Instagram wajib diisi" };
  }

  const trimmed = url.trim();

  // Must not contain javascript: or data:
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return { valid: false, error: "Skema URL tidak aman atau tidak valid" };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") {
      return { valid: false, error: "URL Instagram harus menggunakan protokol HTTPS (contoh: https://instagram.com/...)" };
    }

    const host = parsed.hostname.toLowerCase();
    const validHosts = ["instagram.com", "www.instagram.com", "instagr.am", "m.instagram.com"];
    if (!validHosts.includes(host)) {
      return {
        valid: false,
        error: "Domain URL harus mengarah ke instagram.com (contoh: https://instagram.com/[username])",
      };
    }

    // Must have a path indicating user or post
    if (parsed.pathname === "/" || parsed.pathname === "") {
      return {
        valid: false,
        error: "URL Instagram harus menyertakan profil atau tautan postingan spesifik",
      };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "Format URL Instagram tidak valid. Gunakan format https://instagram.com/[nama-akun]" };
  }
}

export function validateExternalUrl(url?: string): { valid: boolean; error?: string } {
  if (!url || url.trim() === "") {
    return { valid: true };
  }

  const trimmed = url.trim();
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return { valid: false, error: "URL tidak aman" };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { valid: false, error: "URL harus berprotokol HTTP atau HTTPS" };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: "Format URL tidak valid" };
  }
}

export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug || slug.trim() === "") {
    return { valid: false, error: "Slug wajib diisi" };
  }

  const trimmed = slug.trim().toLowerCase();
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(trimmed)) {
    return {
      valid: false,
      error: "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-) tanpa spasi atau karakter khusus",
    };
  }

  if (trimmed.length < 2 || trimmed.length > 80) {
    return { valid: false, error: "Panjang slug harus antara 2 hingga 80 karakter" };
  }

  return { valid: true };
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
