"use client";

import { depositApiRequests } from "@/apiRequests/deposit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { TotalDepositInforsType } from "@/schemaValidations/transaction.schema";
import { useEffect, useState } from "react";

export default function DepositInforCards() {
  const [depositInfors, setDepositInfors] = useState<TotalDepositInforsType>(
    {} as TotalDepositInforsType
  );
  const animatedTotalFund = useAnimatedNumber(depositInfors.totalFund || 0);
  const animatedTotalCount = useAnimatedNumber(depositInfors.totalCount || 0);

  const fetchData = async () => {
    const { payload } = await depositApiRequests.getDepositInfors();
    setDepositInfors(payload);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex md:flex-row flex-col md:space-x-4">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Tổng tiền quỹ</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {animatedTotalFund.toLocaleString("de-DE")}{" "}
            <span className="text-xl text-gray-500">đ</span>
          </p>
        </CardContent>
      </Card>
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Tổng lượt giao dịch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {animatedTotalCount.toLocaleString()}{" "}
            <span className="text-xl text-gray-500">lượt</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
