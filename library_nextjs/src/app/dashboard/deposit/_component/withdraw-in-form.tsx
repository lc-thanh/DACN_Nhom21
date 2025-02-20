"use client";

import { depositApiRequests } from "@/apiRequests/deposit";
import CurrencyInput from "@/components/money-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleApiError } from "@/lib/utils";
import {
  TransactionCreateBody,
  TransactionCreateBodyType,
} from "@/schemaValidations/transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function WithdrawInForm({ callback }: { callback: () => void }) {
  const [loading, setLoading] = useState(false);

  const form = useForm<TransactionCreateBodyType>({
    resolver: zodResolver(TransactionCreateBody),
    defaultValues: {
      amount: 0,
      description: "",
    },
  });

  async function onSubmit(values: TransactionCreateBodyType) {
    try {
      setLoading(true);
      await depositApiRequests.withdrawIn(values);
      toast.success("Thành công!");
      callback();
    } catch (error) {
      handleApiError({ error, toastMessage: "Thất bại!" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
        <FormField
          control={form.control}
          name="amount"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>
                Số tiền <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    className="hidden"
                    placeholder="Nhập giá bìa"
                    type="number"
                    {...fieldProps}
                  />
                  <CurrencyInput onChange={(number) => onChange(number)} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mô tả <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập mô tả..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-2">
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Xác nhận
          </Button>
        </div>
      </form>
    </Form>
  );
}
