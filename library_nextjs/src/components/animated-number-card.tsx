"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnimatedNumber } from "@/hooks/use-animated-number";

interface AnimatedNumberCardProps {
  label: string;
  number: number;
  duration?: number;
}

export function AnimatedNumberCard({
  label,
  number,
  duration = 1000,
}: AnimatedNumberCardProps) {
  const animatedNumber = useAnimatedNumber(number, duration);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{animatedNumber.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}
