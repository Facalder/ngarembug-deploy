export const CONTENT_STATUS_OPTIONS = [
  { value: "draft", label: "Draft", alias: "dft" },
  { value: "published", label: "Dipublikasikan", alias: "pub" },
  { value: "archived", label: "Diarsipkan", alias: "arc" },
] as const;

export const PRICE_RANGE_OPTIONS = [
  { value: "low", label: "Murah", alias: "low" },
  { value: "medium", label: "Sedang", alias: "mid" },
  { value: "high", label: "Mahal", alias: "high" },
  { value: "premium", label: "Premium", alias: "prem" },
] as const;

export const CAFE_TYPE_OPTIONS = [
  { value: "indoor_cafe", label: "Indoor Cafe", alias: "in" },
  { value: "outdoor_cafe", label: "Outdoor Cafe", alias: "out" },
  { value: "indoor_outdoor_cafe", label: "Indoor & Outdoor Cafe", alias: "io" },
] as const;

export const REGION_OPTIONS = [
  { value: "sukabirus", label: "Sukabirus", alias: "skb" },
  { value: "sukapura", label: "Sukapura", alias: "skp" },
  { value: "batununggal", label: "Batununggal", alias: "btn" },
  { value: "buah_batu", label: "Buah Batu", alias: "bbt" },
  { value: "dayeuh_kolot", label: "Dayeuh Kolot", alias: "dyk" },
  { value: "ciganitri", label: "Ciganitri", alias: "cgn" },
  { value: "cijagra", label: "Cijagra", alias: "cjg" },
  { value: "bojongsoang", label: "Bojongsoang", alias: "bjs" },
] as const;

export const REVIEW_STATUS_OPTIONS = [
  { value: "approved", label: "Diterima", alias: "app" },
  { value: "rejected", label: "Ditolak", alias: "rej" },
  { value: "pending", label: "Pending", alias: "pen" },
] as const;

export const STAR_RATING_OPTIONS = [
  { value: "one", label: "Satu", alias: "1" },
  { value: "two", label: "Dua", alias: "2" },
  { value: "three", label: "Tiga", alias: "3" },
  { value: "four", label: "Empat", alias: "4" },
  { value: "five", label: "Lima", alias: "5" },
] as const;

export const VISITOR_TYPE_OPTIONS = [
  { value: "family", label: "Keluarga", alias: "fam" },
  { value: "couple", label: "Pasangan", alias: "cpl" },
  { value: "solo", label: "Solo", alias: "sol" },
  { value: "business", label: "Bisnis", alias: "bus" },
  { value: "friends", label: "Teman", alias: "frn" },
] as const;