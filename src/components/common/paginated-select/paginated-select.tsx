import { Select, Spin } from "antd";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

const PaginatedSelect = ({
  fetchOptions, // (page, searchValue) => Promise<{ options: [], hasMore: boolean }>
  value,
  onChange,
  debounceTimeout = 500,
  ...restProps 
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  // Use a ref to track the internal loading state without causing fetchData to re-create
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
        const { options: newOptions, hasMore: newHasMore } = await fetchOptions(
          currentPage,
          currentSearchValue
        );

        setOptions((prev) => (append ? [...prev, ...newOptions] : newOptions));
        setHasMore(newHasMore); // Update hasMore state
      } catch (error) {
        console.error("Failed to fetch options:", error);
      } finally {
        loadingRef.current = false; 
        setLoading(false); 
      }
    },
    [fetchOptions]
  ); 

  useEffect(() => {
    setPage(1);
    setOptions([]);
    setHasMore(true);

    fetchData(1, searchValue, false);
  }, [searchValue, fetchData]); 

  const debouncedSearch = useRef(
    debounce((val) => {
      setSearchValue(val); 
    }, debounceTimeout)
  ).current;

  // Handler for search input changes
  const handleSearch = useCallback(
    (val) => {
      debouncedSearch(val);
    },
    [debouncedSearch]
  ); // Dependency: debouncedSearch (stable due to useRef)

  // Handler for dropdown scroll events (for infinite scrolling)
  const handlePopupScroll = useCallback(
    (e) => {
      const { target } = e;
      debugger; // Check if scrolled to the bottom of the dropdown
      if (
        target.scrollTop + target.offsetHeight >= target.scrollHeight - 20 &&
        hasMore &&
        !loadingRef.current
      ) {
        // If at bottom, there are more items, and not currently loading (check ref), fetch next page
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          fetchData(nextPage, searchValue, true); // Append new options to existing ones
          return nextPage;
        });
      }
    },
    [hasMore, searchValue, fetchData]
  ); // Dependencies: states that affect scroll logic and fetchData

  return (
    <Select
      showSearch // Enable search functionality
      value={value} // Controlled component value
      onChange={onChange} // Controlled component onChange handler
      onSearch={handleSearch} // Custom search handler (debounced)
      onPopupScroll={handlePopupScroll} // Custom scroll handler for infinite scroll
      filterOption={false} // Disable Ant Design's built-in filtering, as we handle it via `fetchOptions`
      notFoundContent={
        loading && page === 1 ? (
          <Spin size="small" />
        ) : hasMore && loading ? (
          <Spin size="small" />
        ) : (
          "No data"
        )
      }
      options={options} // Options displayed in the dropdown
      loading={loading && page === 1} // AntD's loading prop for the main input spinner (only for initial load/search)
      // The `loading` prop for Select itself shows a spinner in the input field.
      // We only want this for the initial load or a new search.
      // For infinite scroll loading, `notFoundContent` handles the spinner.
      {...restProps} // Pass through any other props like placeholder, disabled, etc.
    />
  );
};

export default PaginatedSelect;
