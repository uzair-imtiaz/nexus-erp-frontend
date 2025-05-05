export function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
    const query = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
  
    return query ? `?${query}` : '';
  }
  