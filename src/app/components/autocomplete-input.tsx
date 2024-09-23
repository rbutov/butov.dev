import React, { useState, type FC, type ChangeEvent } from 'react';

interface AutocompleteInputProps {
  type: 'google' | 'yandex';
  inputValue: string;
  setInputValue: (value: string) => void;
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;
}

const AutocompleteInput: FC<AutocompleteInputProps> = ({
  type,
  inputValue,
  setInputValue,
  suggestions,
  setSuggestions,
}) => {
  const [isSuggestionSelected, setIsSuggestionSelected] =
    useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setIsSuggestionSelected(false);
    setInputValue(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setIsSuggestionSelected(true);
    setInputValue(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="relative mb-4 w-96 max-w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setIsActive(true)}
        onBlur={() => setTimeout(() => setIsActive(false), 200)}
        placeholder={`Введите адрес (${type === 'google' ? 'Google' : 'Yandex'})`}
        className="w-full rounded-md border border-[#393b40] bg-[#2b2d30] px-4 py-2 text-[#dfe1e5] placeholder-[#9da0a8] focus:outline-none focus:ring-2 focus:ring-[#4d9ff8]"
      />
      {isActive && !isSuggestionSelected && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#393b40] bg-[#2b2d30] shadow-lg">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="cursor-pointer px-4 py-2 text-[#dfe1e5] hover:bg-[#393b40]"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {index === 0 ? `Выбрать "${suggestion}"` : suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { AutocompleteInput };
