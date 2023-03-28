import * as React from "react";
import { TagsInput } from "react-tag-input-component";
import { Button } from "semantic-ui-react";

import commonStyles from "../../index.module.scss";

type Props = {
  tags: string[];
  suggestions: string[];
  onChange: (newTags: string[]) => void;
};

export default function InputTagsWithSuggestions({
  tags,
  suggestions,
  onChange,
}: Props) {
  const [isFocused, setFocus] = React.useState(false);
  return (
    <>
      <div
        className={commonStyles.basicTagWrapper}
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
      >
        <TagsInput
          value={tags}
          onChange={(newTags) => {
            onChange && onChange(newTags);
          }}
          onRemoved={() => {
            setFocus(false);
          }}
          onBlur={(event: React.FocusEvent<HTMLInputElement>) =>
            (event.target.value = "")
          }
          name=""
          placeHolder="You can add 2-7 tags to help fans find you"
          classNames={{
            tag: commonStyles.basicTag,
            input: commonStyles.basicTagInput,
          }}
        />
      </div>
      {isFocused ? (
        <div
          className={commonStyles.basicSuggestionWrapper}
          onMouseDown={(event) => {
            event.preventDefault();
            // This will cancel the event that hide the dropdown before the suggestion button is clicked
          }}
          onBlur={() => {
            setFocus(false);
          }}
        >
          <div className={commonStyles.basicSuggestion}>
            <h3 className={commonStyles.basicSuggestionTagTitle}>
              Suggested tags:
            </h3>
            <div className={commonStyles.basicSuggestionTagWrapper}>
              {suggestions &&
                suggestions.map((suggestion, index) => {
                  return (
                    <Button
                      className={commonStyles.basicSuggestionTag}
                      onClick={() => {
                        onChange &&
                          onChange(
                            tags.includes(suggestion)
                              ? tags
                              : tags.concat([suggestion])
                          );
                      }}
                      key={index}
                    >
                      {suggestion}
                    </Button>
                  );
                })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
