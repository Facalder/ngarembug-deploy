import type { SWRConfiguration } from "swr";
import { API_TOKEN, BASE_API_URL } from "@/globals/globals";

const buildUrl = (path: string) => {
  if (path.startsWith("http")) return path;

  const cleanBase = BASE_API_URL.endsWith("/")
    ? BASE_API_URL.slice(0, -1)
    : BASE_API_URL;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${cleanBase}${cleanPath}`;
};

export const fetcher = async (url: string) => {
  const fullUrl = buildUrl(url);

  const res = await fetch(fullUrl, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Terjadi kesalahan saat memproses permintaan.");
  }

  return res.json();
};

export const mutationFetcher = async (
  url: string,
  { arg }: { arg: { method: string; body?: Record<string, unknown> } },
) => {
  const fullUrl = buildUrl(url);

  const res = await fetch(fullUrl, {
    method: arg.method,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg.body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage =
      errorData.error ||
      errorData.message ||
      (errorData.details
        ? JSON.stringify(errorData.details)
        : `HTTP ${res.status}: Terjadi kesalahan saat memproses permintaan.`);

    const error = new Error(errorMessage);
    (error as any).status = res.status;
    (error as any).details = errorData;

    console.error(`[SWR Mutation Error] ${arg.method} ${fullUrl}:`, {
      status: res.status,
      message: errorMessage,
      details: errorData,
    });

    throw error;
  }

  return res.json();
};

export const uploadFetcher = async (
  url: string,
  { arg }: { arg: { method: string; body: FormData } },
) => {
  const fullUrl = buildUrl(url);

  const res = await fetch(fullUrl, {
    method: arg.method,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      // Content-Type is irrelevant for FormData as the browser sets it automatically with boundary
    },
    body: arg.body,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error || "Terjadi kesalahan saat mengunggah file.",
    );
  }

  return res.json();
};

export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshInterval: 0,
  shouldRetryOnError: false,
  dedupingInterval: 60000,
  keepPreviousData: true,
};
