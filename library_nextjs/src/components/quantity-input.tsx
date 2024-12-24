"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuantityInputProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}

export function QuantityInput({
  initialValue = 0,
  min = 0,
  max = Infinity,
  step = 1,
  onChange,
}: QuantityInputProps) {
  const [value, setValue] = React.useState(initialValue);

  const handleIncrement = () => {
    const newValue = Math.min(value + step, max);
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(value - step, min);
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(Math.max(Number(event.target.value), min), max);
    setValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleDecrement}
        disabled={value <= min}
        className="rounded-r-none"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleChange}
        className="w-10 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min={min}
        max={max}
        step={step}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleIncrement}
        disabled={value >= max}
        className="rounded-l-none"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
