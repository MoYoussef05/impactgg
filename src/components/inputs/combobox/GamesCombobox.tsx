"use client";

import * as React from "react";
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from "@/components/ui/combobox";
import { useAllGamesQuery } from "@/hooks/useGamesQuery";

export type GameItem = { label: string; value: string };

function filterGameItems(
  itemValue: GameItem,
  query: string,
  itemToString?: (itemValue: GameItem) => string,
): boolean {
  const str = itemToString ? itemToString(itemValue) : itemValue.label;
  return str.toLowerCase().includes(query.toLowerCase());
}

export interface GamesComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  disabled?: boolean;
  id?: string;
}

export default function GamesCombobox({
  value = "",
  onChange,
  onBlur,
  placeholder = "Select a game…",
  "aria-label": ariaLabel = "Select a game",
  "aria-invalid": ariaInvalid,
  disabled,
  id,
}: GamesComboboxProps) {
  const { data, isLoading, isError, error } = useAllGamesQuery();

  const items: GameItem[] = React.useMemo(
    () =>
      (data?.items ?? []).map((game) => ({
        label: game.title,
        value: game.title,
      })),
    [data?.items],
  );

  const selectedItem = React.useMemo(
    () => items.find((item) => item.value === value) ?? null,
    [items, value],
  );

  const handleValueChange = React.useCallback(
    (newValue: GameItem | null) => {
      onChange?.(newValue?.value ?? "");
    },
    [onChange],
  );

  return (
    <Combobox<GameItem>
      items={items}
      value={selectedItem}
      onValueChange={handleValueChange}
      filter={filterGameItems}
      disabled={disabled}
    >
      <ComboboxInput
        id={id}
        aria-label={ariaLabel}
        aria-invalid={ariaInvalid}
        placeholder={isLoading ? "Loading games…" : placeholder}
        disabled={disabled}
        onBlur={onBlur}
      />
      <ComboboxPopup>
        {isLoading && items.length === 0 ? (
          <div className="p-2 text-center text-sm text-muted-foreground">
            Loading games…
          </div>
        ) : isError ? (
          <div className="p-2 text-center text-sm text-destructive">
            {(error as Error)?.message ?? "Failed to load games."}
          </div>
        ) : (
          <>
            <ComboboxEmpty>No games found.</ComboboxEmpty>
            <ComboboxList>
              {(item: GameItem) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxList>
          </>
        )}
      </ComboboxPopup>
    </Combobox>
  );
}
