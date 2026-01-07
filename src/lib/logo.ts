/**
 * Extracts the domain from a URL and returns the Clearbit logo URL
 * @param websiteUrl - The full website URL (e.g., "https://chat.openai.com" or "https://midjourney.com")
 * @returns Clearbit logo URL (e.g., "https://logo.clearbit.com/openai.com" or "https://logo.clearbit.com/midjourney.com")
 */
export function getClearbitLogoUrl(websiteUrl: string | undefined): string | null {
  if (!websiteUrl) return null;

  try {
    // Ensure the URL has a protocol for URL constructor
    const urlString = websiteUrl.startsWith("http://") || websiteUrl.startsWith("https://")
      ? websiteUrl
      : `https://${websiteUrl}`;
    
    const url = new URL(urlString);
    const domain = url.hostname.replace(/^www\./, ""); // Remove www. prefix
    return `https://logo.clearbit.com/${domain}`;
  } catch {
    // If URL parsing fails, try to extract domain manually
    const match = websiteUrl.match(/(?:https?:\/\/)?(?:www\.)?([^\/\?#]+)/);
    if (match && match[1]) {
      const domain = match[1].replace(/^www\./, "").toLowerCase();
      return `https://logo.clearbit.com/${domain}`;
    }
    return null;
  }
}

/**
 * Generates a colorful initials logo URL using ui-avatars.com
 * @param name - The company/tool name
 * @returns ui-avatars.com URL with initials
 */
export function getInitialsLogoUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=random&color=fff&size=128&bold=true`;
}

