import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AnimatedNumberSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          <Skeleton className="w-36 h-6" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="w-8 h-10" />
      </CardContent>
    </Card>
  );
}
