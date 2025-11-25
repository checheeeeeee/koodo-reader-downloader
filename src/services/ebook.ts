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

const getApiBaseUrl = (): string => {
  const envVal = (process.env.REACT_APP_API_BASE_URL || "").trim();
  if (envVal.length > 0) return envVal;
  const winVal =
    typeof window !== "undefined"
      ? (window.__ENV__?.REACT_APP_API_BASE_URL || "").trim()
      : "";
  if (winVal.length > 0) return winVal;
  return process.env.NODE_ENV === "development" ? "/proxy-api" : "";
};
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
    headers.set("clientid", "cdafd42e4f9befd1017351d82706b4f6");
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
