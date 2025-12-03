import axios, { AxiosRequestConfig } from "axios";
import bcrypt from "bcryptjs";

// Query params type
type QueryParams = Record<string, string | number | boolean | null | undefined>;

// Options type
type FetchOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  params?: QueryParams;
};

class ApiClient {
  // --------------------------
  // Build query strings
  // --------------------------
  private buildQuery(params?: QueryParams): string {
    if (!params) return "";

    const query = Object.entries(params)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");

    return query ? `?${query}` : "";
  }

  // --------------------------
  // Normalize endpoint
  // --------------------------
  public normalizeEndpoint(endpoint: string): string {
    if (endpoint.startsWith("http")) return endpoint;

    let clean = endpoint.replace(/^\/+/, "");

    if (!clean.startsWith("api/")) clean = "api/" + clean;

    return `${process.env.NEXT_PUBLIC_APP_URL}/${clean}`;
  }

  // --------------------------
  // Core Request Handler
  // --------------------------
  private async fetch<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const { method = "GET", body, headers = {}, params } = options || {};

    const finalHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const queryStr = this.buildQuery(params);

    // If endpoint is already an absolute URL (http/https), use it as-is
    let url: string;
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      url = endpoint + queryStr;
    } else {
      // Handle relative endpoints
      const cleanEndpoint = endpoint.replace(/^\/+/, "");
      
      if (!cleanEndpoint.startsWith("api/")) {
        url = "/api/" + cleanEndpoint + queryStr;
      } else {
        url = "/" + cleanEndpoint + queryStr;
      }
    }

    const config: AxiosRequestConfig = {
      url,
      method,
      headers: finalHeaders,
      data: body,
    };

    try {
      const response = await axios<T>(config);
      return response.data;
    } catch (err: any) {
      const axiosError = err;
      let message = "Something went wrong";

      if (axiosError.response) {
        const data = axiosError.response.data;
        message =
          data?.message ||
          data?.error ||
          axiosError.response.statusText ||
          "Unexpected server error";
      } else if (axiosError.request) {
        message = "Server not responding. Please check your connection.";
      } else if (axiosError.message) {
        message = axiosError.message;
      }

      throw new Error(message);
    }
  }

  // --------------------------
  // GET
  // --------------------------
  public get<T>(endpoint: string): Promise<T>;
  public get<T>(endpoint: string, params: QueryParams): Promise<T>;
  public get<T>(
    endpoint: string,
    params: QueryParams,
    headers: Record<string, string>
  ): Promise<T>;
  public get<T>(
    endpoint: string,
    params?: QueryParams,
    headers?: Record<string, string>
  ) {
    return this.fetch<T>(endpoint, {
      method: "GET",
      params,
      headers,
    });
  }

  // --------------------------
  // POST
  // --------------------------
  public post<T>(endpoint: string): Promise<T>;
  public post<T>(endpoint: string, body: any): Promise<T>;
  public post<T>(endpoint: string, body: any, params: QueryParams): Promise<T>;
  public post<T>(
    endpoint: string,
    body: any,
    params: QueryParams,
    headers: Record<string, string>
  ): Promise<T>;
  public post<T>(
    endpoint: string,
    body?: any,
    params?: QueryParams,
    headers?: Record<string, string>
  ) {
    return this.fetch<T>(endpoint, {
      method: "POST",
      body,
      params,
      headers,
    });
  }

  // --------------------------
  // PUT
  // --------------------------
  public put<T>(endpoint: string): Promise<T>;
  public put<T>(endpoint: string, body: any): Promise<T>;
  public put<T>(endpoint: string, body: any, params: QueryParams): Promise<T>;
  public put<T>(
    endpoint: string,
    body: any,
    params: QueryParams,
    headers: Record<string, string>
  ): Promise<T>;
  public put<T>(
    endpoint: string,
    body?: any,
    params?: QueryParams,
    headers?: Record<string, string>
  ) {
    return this.fetch<T>(endpoint, {
      method: "PUT",
      body,
      params,
      headers,
    });
  }

  // --------------------------
  // DELETE
  // --------------------------
  public delete<T>(endpoint: string): Promise<T>;
  public delete<T>(endpoint: string, params: QueryParams): Promise<T>;
  public delete<T>(
    endpoint: string,
    params: QueryParams,
    headers: Record<string, string>
  ): Promise<T>;
  public delete<T>(
    endpoint: string,
    params?: QueryParams,
    headers?: Record<string, string>
  ) {
    return this.fetch<T>(endpoint, {
      method: "DELETE",
      params,
      headers,
    });
  }

  // --------------------------
  // OTP hash compare
  // --------------------------
  public verifyOtpHash(code: string, hash: string): Promise<boolean> {
    return bcrypt.compare(code, hash);
  }
}

export const apiClient = new ApiClient();
