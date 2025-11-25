export async function fetchData<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // 安全获取 token
  const token = localStorage.getItem("Admin-Tokens");

  if (typeof token !== "string") {
    // 可选：是否允许无 token 请求？根据业务决定
    console.warn("Access token is not a string:", token);
  }

  // 合并 headers：保留传入的 headers，并添加认证头
  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("clientid", "cdafd42e4f9befd1017351d82706b4f6");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
