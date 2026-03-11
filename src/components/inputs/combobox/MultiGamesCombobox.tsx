"use client";

import * as React from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxEmpty,
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

export interface MultiGamesComboboxProps {
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  "aria-label"?: string;
  "aria-invalid"?: boolean;
  disabled?: boolean;
  id?: string;
}

export default function MultiGamesCombobox({
  value,
  onChange,
  onBlur,
  placeholder = "Filter by games…",
  "aria-label": ariaLabel = "Filter by games",
  "aria-invalid": ariaInvalid,
  disabled,
  id,
}: MultiGamesComboboxProps) {
  const { data, isLoading, isError, error } = useAllGamesQuery();

  const items: GameItem[] = React.useMemo(
    () =>
      (data?.items ?? []).map((game) => ({
        label: game.title,
        value: game.title,
      })),
    [data?.items],
  );

  const selectedItems = React.useMemo(() => {
    const set = new Set(value);
    return items.filter((i) => set.has(i.value));
  }, [items, value]);

  const handleValueChange = React.useCallback(
    (newValue: GameItem[] | null) => {
      const next = (newValue ?? []).map((i) => i.value);
      onChange(Array.from(new Set(next)));
    },
    [onChange],
  );

  return (
    <div suppressHydrationWarning>
      <Combobox<GameItem, true>
        items={items}
        multiple
        value={selectedItems}
        onValueChange={handleValueChange}
        filter={filterGameItems}
        disabled={disabled}
      >
        <ComboboxChips>
          {selectedItems.map((item) => (
            <ComboboxChip key={item.value}>
              {item.label}
            </ComboboxChip>
          ))}
          <ComboboxChipsInput
            id={id}
            aria-label={ariaLabel}
            aria-invalid={ariaInvalid}
            placeholder={isLoading ? "Loading games…" : placeholder}
            disabled={disabled}
            onBlur={onBlur}
          />
        </ComboboxChips>

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
    </div>
  );
}

