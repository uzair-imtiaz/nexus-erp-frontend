import { InfiniteScrollParams, SelectOption } from "./types";

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const query = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  return query ? `?${query}` : "";
}

export const prettifyLabel = (label: string): string => {
  return label
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase());
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 2,
  }).format(value);
};

export const isEmptyObject = (obj: Record<string, unknown>) =>
  obj &&
  Object.keys(obj).length === 0 &&
  Object.getPrototypeOf(obj) === Object.prototype;

export const infiniteScrollApiCall = async <T>({
  api,
  query = "",
  key,
  page = 1,
  extraParams = {},
}: InfiniteScrollParams<T>) => {
  const updatedQueryStr = !isEmptyObject(extraParams)
    ? `&${buildQueryString(extraParams)}${query}`
    : query;

  const data = await api(
    updatedQueryStr ? `?page=${page}${updatedQueryStr}` : `?page=${page}`,
    true
  );

  if (data[key]) {
    return {
      list: data[key] as T[],
      current_page: data?.pagination?.current_page,
      next_page: data?.pagination?.next_page,
    };
  }
  return { list: [], current_page: null, next_page: null };
};

interface FormatOptionsParams {
  list: SelectOption[];
  isGrouped?: boolean;
}

export const formatOptionsForSelect = ({
  list = [],
  isGrouped = false,
}: FormatOptionsParams) => {
  if (isGrouped) {
    return list?.map((item) => ({
      ...item,
      options: item.options?.map((innerOption) => ({
        ...innerOption,
        value: innerOption.id,
        label: innerOption.name,
        name: innerOption.name,
      })),
    }));
  }

  return list?.map((item) => ({
    ...item,
    value: item.id,
    label: item.name,
    name: item.name,
  }));
};
