"use client";

import categoryApiRequests from "@/apiRequests/category";
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
  CreateCategoryBody,
  CreateCategoryBodyType,
} from "@/schemaValidations/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateCategoryForm({
  id,
  callback,
}: {
  id: string;
  callback: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateCategoryBodyType>({
    resolver: zodResolver(CreateCategoryBody),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { payload } = await categoryApiRequests.get(id);
        form.setValue("name", payload.name);
        if (payload.description) {
          form.setValue("description", payload.description);
        }
      } catch (error) {
        handleApiError({
          error,
          toastMessage: "Có lỗi xảy ra trong quá trình tải dữ liệu danh mục!",
        });
      }
    };
    fetchCategory();
  }, [form, id]);

  async function onSubmit(values: CreateCategoryBodyType) {
    try {
      setLoading(true);
      await categoryApiRequests.update(id, values);
      toast.success("Cập nhật danh mục thành công!");
      callback();
    } catch (error) {
      handleApiError({ error, toastMessage: "Cập nhật danh mục thất bại!" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên danh mục <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên danh mục" {...field} />
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
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập mô tả sách" {...field} />
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
