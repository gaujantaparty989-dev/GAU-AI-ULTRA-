// Huffman/Gzip Compression Utilities of GOW AI ULTRA for URL sharing
export async function compressToUrlSafeB64(text: string): Promise<string> {
  try {
    const stream = new Blob([text]).stream();
    const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
    const response = new Response(compressedStream);
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // Chunk-based conversion to safely handle larger payloads limits
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
    }
    
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (err) {
    console.error('Compression failed, falling back to basic URI encoding:', err);
    return encodeURIComponent(text);
  }
}

export async function decompressFromUrlSafeB64(b64: string): Promise<string> {
  try {
    // Check if it might be a normal encoded string rather than base64
    if (!/^[A-Za-z0-9_-]+$/.test(b64)) {
      return decodeURIComponent(b64);
    }
    
    let normalized = b64.replace(/-/g, '+').replace(/_/g, '/');
    while (normalized.length % 4) {
      normalized += '=';
    }
    
    const binary = atob(normalized);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    const stream = new Blob([bytes]).stream();
    const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
    const response = new Response(decompressedStream);
    return await response.text();
  } catch (err) {
    console.error('Decompression failed, falling back to URI decode:', err);
    try {
      return decodeURIComponent(b64);
    } catch {
      throw new Error('Invalid shared link code format');
    }
  }
}
