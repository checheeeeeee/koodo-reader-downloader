import { getApiBaseUrl } from "./fetch";
// 通用响应类型（用于更新、删除等操作）
export interface ApiResponse {
  code: number;
  message?: string;
  data?: unknown;
  rows?: unknown[];
}

type EnvMap = Record<string, string>;
declare global {
  interface Window {
    __ENV__?: EnvMap;
  }
}


export const downloadElectronicBook = async (
  electronicBookId: string
): Promise<{
  buffer: ArrayBuffer;
  filename?: string;
  contentType?: string;
}> => {
  const token = localStorage.getItem("Admin-Tokens");
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("clientid", process.env.REACT_APP_CLIENT_ID || "");
  }
  const res = await fetch(
    `${getApiBaseUrl()}/knowledge/electronicBook/download/${electronicBookId}`,
    { method: "GET", headers }
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const blob = await res.blob();
  const buffer = await blob.arrayBuffer();
  const cd = res.headers.get("content-disposition") || "";
  const ct = res.headers.get("content-type") || "";
  const match = cd.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
  const filename = decodeURIComponent(match?.[1] || match?.[2] || "");
  return { buffer, filename, contentType: ct };
};

export const downloadElectronicBookWithProgress = async (
  electronicBookId: string,
  onProgress?: (received: number, total: number) => void
): Promise<{
  buffer: ArrayBuffer;
  filename?: string;
  contentType?: string;
  totalBytes?: number;
}> => {
  const token = localStorage.getItem("Admin-Tokens");
  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("clientid", process.env.REACT_APP_CLIENT_ID || "");
  }
  const res = await fetch(
    `${getApiBaseUrl()}/knowledge/electronicBook/download/${electronicBookId}`,
    { method: "GET", headers }
  );
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const cd = res.headers.get("content-disposition") || "";
  const ct = res.headers.get("content-type") || "";
  const match = cd.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
  const filename = decodeURIComponent(match?.[1] || match?.[2] || "");
  const totalHeader = res.headers.get("content-length") || "";
  const total = parseInt(totalHeader) || 0;
  if (res.body && typeof res.body.getReader === "function") {
    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.byteLength;
        onProgress && onProgress(received, total);
      }
    }
    const combined = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return {
      buffer: combined.buffer,
      filename,
      contentType: ct,
      totalBytes: total || received,
    };
  } else {
    const blob = await res.blob();
    const buffer = await blob.arrayBuffer();
    onProgress && onProgress(buffer.byteLength, buffer.byteLength);
    return { buffer, filename, contentType: ct, totalBytes: buffer.byteLength };
  }
};
