// import { ApiResponse } from "@/types/api/helper/api-response";
import axios, { AxiosRequestConfig } from "axios";

// Query params type
type QueryParams = Record<string, string | number | boolean | null | undefined>;

// Options
type FetchOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  params?: QueryParams;
};

class ApiClient {
  // Build ?a=1&b=2
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
  public normalizeEndpoint(endPoint: string): string {
    if (endPoint.startsWith("http")) return endPoint; // full URL

    let clean = endPoint.replace(/^\/+/, ""); // remove leading slashes

    if (!clean.startsWith("api/")) {
      clean = "api/" + clean;
    }

    return `${process.env.NEXT_PUBLIC_APP_URL}/${clean}`;
  }

  // Core request method
  private async fetch<T>(endPoint: string, options?: FetchOptions): Promise<T> {
    const { method = "GET", body, headers = {}, params } = options || {};

    const finalHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const queryString = this.buildQuery(params);

    // --- FIXED URL NORMALIZATION ---
    let url = endPoint;

    if (endPoint.startsWith("http")) {
      url = endPoint + queryString;
    } else {
      let clean = endPoint.replace(/^\/+/, "");

      if (!clean.startsWith("api/")) {
        clean = "api/" + clean;
      }

      url = "/" + clean + queryString;
    }

    const config: AxiosRequestConfig = {
      url,
      method,
      headers: finalHeaders,
      data: body,
    };

    console.log("FINAL URL →", config.url);

    const response = await axios<T>(config);
    console.log({ response: response.data }); //remove
    return response.data;
  }

  // ----------------------------
  // GET Overloads
  // ----------------------------
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

  // ----------------------------
  // POST Overloads
  // ----------------------------
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

  // ----------------------------
  // PUT Overloads
  // ----------------------------
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

  // ----------------------------
  // DELETE Overloads
  // ----------------------------
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
}

export const apiClient = new ApiClient();
