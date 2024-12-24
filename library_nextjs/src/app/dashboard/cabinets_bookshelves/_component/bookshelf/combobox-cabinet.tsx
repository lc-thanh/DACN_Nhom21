"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn, handleApiError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CabinetType } from "@/schemaValidations/cabinet.schema";
import cabinetApiRequests from "@/apiRequests/cabinet";

export function ComboboxCabinet({
  value,
  setValue,
}: {
  value: string | undefined;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [cabinets, setCabinets] = React.useState<CabinetType[]>([]);

  React.useEffect(() => {
    const fetchCabinets = async () => {
      try {
        const { payload } = await cabinetApiRequests.getCabinets();
        setCabinets(payload);
      } catch (error) {
        handleApiError({
          error,
          toastMessage: "Không lấy được dữ liệu tủ sách!",
        });
      }
    };
    fetchCabinets();
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? cabinets.find((cabinet) => cabinet.id === value)?.name
            : "Chọn tủ sách..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Tìm..." className="h-9" />
          <CommandList className="max-h-[50vh]">
            <CommandEmpty>Không tìm thấy tủ nào</CommandEmpty>
            <CommandGroup>
              {cabinets.map((cabinet) => (
                <CommandItem
                  key={cabinet.id}
                  onSelect={() => {
                    setValue(cabinet.id === value ? "" : cabinet.id);
                    setOpen(false);
                  }}
                >
                  {cabinet.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === cabinet.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
