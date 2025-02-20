import { cn } from "@/lib/utils";
import React, { useState, useEffect, ChangeEvent } from "react";

interface CurrencyInputProps {
  initialValue?: number;
  onChange?: (value: number) => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  initialValue = 0,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    formatCurrency(initialValue)
  );

  useEffect(() => {
    setInputValue(formatCurrency(initialValue));
  }, [initialValue]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const numericValue = parseInt(value, 10) || 0;
    setInputValue(formatCurrency(numericValue));
    onChange?.(numericValue);
  };

  function formatCurrency(value: number): string {
    return value.toLocaleString("vi-VN", { maximumFractionDigits: 0 });
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "w-full px-3 py-2 text-right pr-8 border border-gray-300 rounded-md"
        )}
        aria-label="Currency input in Vietnamese Dong"
      />
      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        đ
      </span>
    </div>
  );
};

export default CurrencyInput;
