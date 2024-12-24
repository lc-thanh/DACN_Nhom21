"use client";

import memberApiRequests from "@/apiRequests/member";
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
import { Skeleton } from "@/components/ui/skeleton";
import { handleApiError } from "@/lib/utils";
import {
  CreateMemberBody,
  CreateMemberBodyType,
} from "@/schemaValidations/member.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateMemberForm({
  id,
  callback,
}: {
  id: string;
  callback: () => void;
}) {
  const [loadingFetching, setLoadingFetching] = useState(true);
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateMemberBodyType>({
    resolver: zodResolver(CreateMemberBody),
    defaultValues: {
      fullName: "",
      phone: "",
      individualId: "",
      email: "",
    },
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoadingFetching(true);
        const { payload } = await memberApiRequests.get(id);
        form.setValue("fullName", payload.fullName);
        form.setValue("phone", payload.phone);
        form.setValue("individualId", payload.individualId);
        if (payload.email) {
          form.setValue("email", payload.email);
        }
      } catch (error) {
        handleApiError({
          error,
          toastMessage: "Tải dữ liệu thất bại!",
        });
      } finally {
        setLoadingFetching(false);
      }
    };
    fetchCategory();
  }, [form, id]);

  async function onSubmit(values: CreateMemberBodyType) {
    try {
      setLoading(true);
      await memberApiRequests.update(id, values);
      toast.success("Cập nhật thành công!");
      callback();
    } catch (error) {
      handleApiError({
        error,
        toastMessage: "Cập nhật thất bại!",
        setErrorForm: form.setError,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Họ và tên <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                {loadingFetching ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <Input placeholder="Nhập họ và tên" {...field} />
                )}
              </FormControl>
              {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="individualId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Mã sinh viên/giảng viên{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                {loadingFetching ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <Input
                    placeholder="Nhập mã sinh viên/giảng viên"
                    {...field}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Số điện thoại <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                {loadingFetching ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <Input placeholder="Nhập số điện thoại" {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                {loadingFetching ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <Input placeholder="Nhập email" {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="!mt-8 w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Sửa
        </Button>
      </form>
    </Form>
  );
}
