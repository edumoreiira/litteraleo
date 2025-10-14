/**
 * Removes all HTML tags from the provided text string.
 * @param text - The text containing HTML tags to be removed
 * @returns The sanitized text without any HTML tags
 */
export function sanitizeHtml(text: string): string {
  if (!text) {
    return '';
  }

  // Create a temporary div element to use the browser's HTML parser
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = text;

  // Get the text content without HTML tags
  return tempDiv.textContent || tempDiv.innerText || '';
}

/**
 * Removes all HTML tags from the provided text string using regex.
 * This is a faster alternative that doesn't require DOM manipulation.
 * @param text - The text containing HTML tags to be removed
 * @returns The sanitized text without any HTML tags
 */
export function sanitizeHtmlRegex(text: string): string {
  if (!text) {
    return '';
  }

  // Remove HTML tags using regex
  return text.replace(/<[^>]*>/g, '');
}
