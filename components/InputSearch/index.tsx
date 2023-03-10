import { useRouter } from "next/router";
import React from "react";

import { useAllProjects } from "../../containers/PageHome/hooks/useAllProjects";

import DropdownFeatured from "./components/DropdownFeatured";
import DropdownPopularTag from "./components/DropdownPopularTag";
import SearchResults from "./components/SearchResults";
import InputWithDropdown from "./containers/InputWithDropdown";
import * as Api from "./hooks/api";

import { useDebounce } from "@/modules/common-hooks/hooks/useDebounce";

type Props = {
  className?: string;
  style?: React.CSSProperties;
};

export default function InputSearch({ className, style }: Props) {
  const router = useRouter();
  const [isActive, setIsActive] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [searchValue$Debounced] = useDebounce(searchValue, { delay: 500 });
  const popularTagsResponse = Api.useTags();
  const searchResultsResponse = useAllProjects({
    searchQuery: searchValue$Debounced,
    searchMethod: "prefix",
  });
  const featuredProjectsResponse = useAllProjects({ category: "featured" });
  React.useEffect(() => {
    if (router.isReady) {
      setSearchValue(
        typeof router.query["query"] === "string" ? router.query["query"] : ""
      );
    }
  }, [router.isReady, router.query]);

  return (
    <>
      <InputWithDropdown
        className={className}
        style={style}
        value={searchValue}
        active={isActive}
        dropdownItems={
          searchValue
            ? [
                {
                  content: (
                    <SearchResults
                      error={searchResultsResponse.error}
                      data={searchResultsResponse.data}
                      onClick={() => setIsActive(false)}
                    />
                  ),
                },
              ]
            : [
                {
                  content: (
                    <DropdownFeatured
                      error={featuredProjectsResponse.error}
                      data={featuredProjectsResponse.data}
                      onClick={(customUrl: string) => {
                        setIsActive(false);
                        router.push(`/c/${customUrl}`);
                      }}
                    />
                  ),
                },
                {
                  content: (
                    <DropdownPopularTag
                      error={popularTagsResponse.error}
                      data={popularTagsResponse.data}
                      onClick={(tag: string) => {
                        setIsActive(false);
                        const search = new URLSearchParams();
                        search.append("tag", tag);
                        router.push(`/search?${search.toString()}`);
                      }}
                    />
                  ),
                },
              ]
        }
        onActive={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        onChange={(content: string) => setSearchValue(content)}
        onSubmit={() => {
          setIsActive(false);
          router.push({
            pathname: "/search",
            query: { query: searchValue },
          });
        }}
      />
    </>
  );
}
