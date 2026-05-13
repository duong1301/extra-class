"use client";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { useEffect, useLayoutEffect, useState } from "react";

export function ComboboxPopup({
  value=null,
  keyField = "_id",
  onValueChange = () => {},
  data = [],
  className,
  ...props
}) {
  const [_value, setValue] = useState("");

  useEffect(() => {
    if(value) {
      setValue(value)
    }else
    if (data[0]) setValue(data[0]);
  }, [data, value]);

  return (
    <>
      <Combobox
        className={className}
        {...props}
        items={data}
        value={_value}
        onValueChange={(v) => {
          setValue(v)
          onValueChange(v);
        }}
      >
        <ComboboxTrigger
          render={
            <Button
              variant="outline"
              className="w-64 justify-between font-normal"
            >
              <ComboboxValue />
            </Button>
          }
        />
        <ComboboxContent>
          <ComboboxInput showTrigger={false} placeholder="Search" />
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item[keyField]} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </>
  );
}
