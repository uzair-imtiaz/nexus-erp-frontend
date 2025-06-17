export interface OptionType {
  id?: string;
  value: string;
  label: string;
}

export interface InfiniteScrollSearchSelectProps {
  options?: OptionType[];
  value?: OptionType;
  onChange?: (value: OptionType[]) => void;
  mode?: "multiple" | "tags" | undefined;
  placeholder?: string;
  fetch: (pageNum?: number, search?: string) => Promise<any>;
}
