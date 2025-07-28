import { notification, Select, Spin } from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { buildQueryString } from "../../../utils";

const PaginatedSelect = ({
  api,
  apiParams = null,
  queryParamName = "name",
  valueExtractor = (item) => item.id,
  labelExtractor = (item) => `${item.name} (${item.code})`,
  debounceTimeout = 500,
  value,
  onChange,
  optionsFormatter = null,
  ...restProps
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const loadingRef = useRef(false);

  const fetchData = useCallback(
    async (currentPage, currentSearchValue, append = false) => {
      if (loadingRef.current) {
        console.log("Already loading, skipping fetch.");
        return;
      }

      loadingRef.current = true;
      setLoading(true);
      try {
        const queryParams = {
          page: currentPage,
          [queryParamName]: currentSearchValue,
          ...(apiParams ? apiParams : {}),
        };
        const query = buildQueryString(queryParams);

        const response = await api(query);
        if (!response?.success) {
          notification.error({
            message: "Error",
            description: response?.message,
          });
        }

        let mappedOptions;
        if (optionsFormatter) {
          mappedOptions = optionsFormatter(response?.data);
        } else {
          const fetchedData = response?.data;
          mappedOptions = fetchedData.map((item) => ({
            value: valueExtractor(item),
            label: labelExtractor(item),
            key: valueExtractor(item),
          }));
        }
        const newHasMore = response?.pagination?.nextPage;

        setOptions((prev) =>
          append ? [...prev, ...mappedOptions] : mappedOptions
        );
        setHasMore(newHasMore);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setOptions([]);
        setHasMore(false);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [api, apiParams, queryParamName, valueExtractor, labelExtractor]
  );

  useEffect(() => {
    setPage(1);
    setOptions([]);
    setHasMore(true);

    if (!loadingRef.current) fetchData(1, searchValue, false);
  }, [searchValue, apiParams]);

  const debouncedSearch = useRef(
    debounce((val) => {
      setSearchValue(val);
    }, debounceTimeout)
  ).current;

  const handleSearch = useCallback(
    (val) => {
      debouncedSearch(val);
    },
    [debouncedSearch]
  );

  const handlePopupScroll = useCallback(
    (e) => {
      const { target } = e;
      if (
        target.scrollTop + target.offsetHeight >= target.scrollHeight - 20 &&
        hasMore &&
        !loadingRef.current
      ) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          fetchData(nextPage, searchValue, true);
          return nextPage;
        });
      }
    },
    [hasMore, searchValue, fetchData]
  );

  return (
    <Select
      showSearch
      value={value}
      onChange={onChange}
      onSearch={handleSearch}
      onPopupScroll={handlePopupScroll}
      filterOption={false}
      allowClear
      notFoundContent={
        loading && page === 1 ? (
          <Spin size="small" />
        ) : hasMore && loading ? (
          <Spin size="small" />
        ) : (
          "No data"
        )
      }
      options={options}
      loading={loading && page === 1}
      {...restProps}
    />
  );
};

export default PaginatedSelect;
