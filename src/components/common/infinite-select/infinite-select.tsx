import { notification, Select, Spin } from "antd";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import { InfiniteScrollSearchSelectProps, OptionType } from "./types";

const { Option } = Select;

const InfiniteScrollSearchSelect: React.FC<InfiniteScrollSearchSelectProps> = ({
  fetch,
  mode,
  placeholder,
}) => {
  const [options, setOptions] = useState<OptionType[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchOptions = async (pageNum = 1, search = "") => {
    try {
      if (loading || nextPage === null) return;
      setLoading(true);
      const response = await fetch(pageNum, search);
      const newOptions = response?.data.map((item: any) => ({
        value: item.id,
        label: item.name,
      }));

      setOptions((prev) =>
        pageNum === 1 ? newOptions : [...prev, ...newOptions]
      );
      setNextPage(response?.pagination.nextPage);
    } catch (error) {
      notification.error({ message: error.message });
      console.error("Failed to fetch options:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions(1, searchText);
  }, [searchText]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    debugger;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20 && nextPage !== null) {
      fetchOptions(nextPage, searchText);
    }
  };

  const debounceSearch = useCallback(
    debounce((value: string) => {
      setOptions([]);
      setNextPage(1);
      setSearchText(value);
    }, 500),
    []
  );

  const handleSearch = (value: string) => {
    debounceSearch(value);
  };

  return (
    <Select
      showSearch
      mode={mode}
      style={{ width: 300 }}
      placeholder={placeholder}
      optionLabelProp="label"
      filterOption={false}
      notFoundContent={loading ? <Spin size="small" /> : "No data"}
      onPopupScroll={handleScroll}
      onSearch={handleSearch}
      allowClear
    >
      {options?.map((option) => (
        <Option key={option.value} value={option.value} label={option.label}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default InfiniteScrollSearchSelect;
