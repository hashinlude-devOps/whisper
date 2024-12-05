type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiOptions {
  method?: ApiMethod;
  body?: Record<string, any> | FormData;  
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL  // You can set your base URL

export const apiClient = async <T>(
  endpoint: string,
  { method = "GET", body, headers = {}, params = {} }: ApiOptions = {}
): Promise<{ status: number; data: T }> => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  // Add params to the URL if present
  Object.keys(params).forEach(key => url.searchParams.append(key, String(params[key])));

  const accessToken = localStorage.getItem("access_token");

  if (accessToken && !endpoint.includes("/login") && !endpoint.includes("/signup")) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  if (body instanceof FormData) {
    delete headers["Content-Type"];  
  } else if (body) {
    headers["Content-Type"] = "application/json";  
  }


  const options: RequestInit = {
    method,
    headers: {
      ...headers,
    },
    ...(body && { body: body instanceof FormData ? body : JSON.stringify(body) }),  
  };


  try {
    const response = await fetch(url.toString(), options);
    if (response.status === 401) {
        window.location.href = '/sign-in';  
        return { status: 401, data: {} as T }; 
    }
    // If the response is a binary file (audio, for example), return the blob directly
    if (response.headers.get("Content-Type")?.startsWith("audio")) {
      const blob = await response.blob();
      return { status: response.status, data: blob as unknown as T }; // Return as blob
    }

    const data = await response.json();

    return { status: response.status, data };  
  } catch (error: any) {
    console.error(`API Error [${method} ${url}]:`, error.message);
    throw error;
  }
};
