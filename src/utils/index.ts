import { InfiniteScrollParams, SelectOption } from "./types";

export function buildQueryString(params: Record<string, any>): string {
  const query = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map(
            (val) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`
          )
        : [`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`]
    )
    .join("&");
  return query ? `?${query}` : "";
}

export const prettifyLabel = (label: string): string => {
  return label
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase());
};

export const formatCurrency = (value: number, precision = 2) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: precision,
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

export const recalculateCostFiPercent = (items: any[]) => {
  const totalQuantity = items.reduce(
    (sum, item) => sum + (parseFloat(item.quantity) || 0),
    0
  );

  return items.map((item) => ({
    ...item,
    costFiPercent:
      totalQuantity > 0
        ? ((parseFloat(item.quantity) || 0) / totalQuantity) * 100
        : 0,
  }));
};

export const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};

export const mapFinishedGoods = (products: any[], inventoryItems: any[]) =>
  (products || []).map((item: any) => {
    const available = inventoryItems.find((i: any) => i.id === item.product_id);
    const _item = {
      ...available, // hydrate meta info
      ...item, // override with server values
      id: item.product_id,
      productId: item.product_id,
      quantity: item.quantityRequired,
    };
    return _item;
  });

export const mapIngredients = (ingredients: any[], inventoryItems: any[]) =>
  (ingredients || []).map((item: any) => {
    const available = inventoryItems.find(
      (i: any) => i.id === item.inventory_item_id
    );
    return {
      ...available,
      ...item,
      id: item.inventory_item_id,
      productId: item.inventory_item_id,
      qtyRequired: item.quantityRequired,
    };
  });

export const mapExpenses = (expenses: any[], expensesList: any[]) =>
  (expenses || []).map((item: any) => {
    const available = expensesList.find(
      (i: any) => i.id === item.expense_account_id
    );
    return {
      ...available,
      ...item,
      id: item.expense_account_id,
      expenseId: item.expense_account_id,
      qtyRequired: item.quantityRequired,
    };
  });

// src/utils/formulationPayload.ts

export const buildProductsPayload = (finishedGoods: any[]) => {
  return (finishedGoods || []).map((item) => ({
    product_id: parseInt(item.productId ?? item.id),
    name: item?.name || "",
    description: item.description || "",
    qtyFiPercent: parseFloat(item.qtyFiPercent) || 0,
    unit: item.unit || "",
    costFiPercent: parseFloat(item.costFiPercent) || 0,
    baseQuantity: parseFloat(item.baseQuantity) || 0,
    quantityRequired: parseFloat(item.quantity) || 0,
  }));
};

export const buildIngredientsPayload = (ingredients: any[]) => {
  return (ingredients || []).map((item) => ({
    inventory_item_id: parseInt(item.productId ?? item.id),
    name: item?.name || "",
    description: item.description || "",
    quantityRequired: parseFloat(item.qtyRequired) || 0,
    perUnit: parseFloat(item.perUnit) || 0,
    unit: item.unit || "",
    availableQuantity: parseFloat(item.quantity) || 0,
    amount: parseFloat((item.qtyRequired || 0) * (item.baseRate || 0)) || 0,
  }));
};

export const buildExpensesPayload = (expenses: any[]) => {
  return (expenses || []).map((item) => ({
    expense_account_id: parseInt(item.expenseId ?? item.id),
    name: item?.name || "",
    quantityRequired: parseFloat(item.qtyRequired) || 0,
    details: item.details || "",
    perUnit: parseFloat(item.perUnit) || 0,
    rate: parseFloat(item.rate) || 0,
    amount: parseFloat((item.rate || 0) * (item.qtyRequired || 0)) || 0,
  }));
};
