import * as cheerio from 'cheerio';

export async function fetchWebPageText(url: string): Promise<string | null> {
  try {
    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }
    
    // Quick basic fetch with common user-agent to avoid simple blocks
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      // Timeout after 10 seconds
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn(`[FetchWeb] Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return null;
    }

    const html = await response.text();
    
    // Parse using cheerio to strip out script, style, and extract raw text
    const $ = cheerio.load(html);
    $('script, style, noscript, iframe, img, svg, video, audio').remove();
    
    let text = $('body').text();
    
    // Clean up excessive whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Limit to ~20,000 characters to prevent token explosion for OpenAI
    if (text.length > 20000) {
      text = text.substring(0, 20000);
    }
    
    return text;
  } catch (error) {
    console.error(`[FetchWeb] Error fetching ${url}:`, error);
    return null;
  }
}
