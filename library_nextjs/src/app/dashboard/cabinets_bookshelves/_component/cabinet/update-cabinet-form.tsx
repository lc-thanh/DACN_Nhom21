"use client";

import cabinetApiRequests from "@/apiRequests/cabinet";
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
import { handleApiError } from "@/lib/utils";
import {
  CreateCabinetBody,
  CreateCabinetBodyType,
} from "@/schemaValidations/cabinet.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateCabinetForm({
  id,
  callback,
}: {
  id: string;
  callback: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateCabinetBodyType>({
    resolver: zodResolver(CreateCabinetBody),
    defaultValues: {
      name: "",
      location: "",
    },
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { payload } = await cabinetApiRequests.get(id);
        form.setValue("name", payload.name);
        if (payload.location) {
          form.setValue("location", payload.location);
        }
      } catch (error) {
        handleApiError({
          error,
          toastMessage: "Có lỗi xảy ra trong quá trình tải dữ liệu tủ sách!",
        });
      }
    };
    fetchCategory();
  }, [form, id]);

  async function onSubmit(values: CreateCabinetBodyType) {
    try {
      setLoading(true);
      await cabinetApiRequests.update(id, values);
      toast.success("Cập nhật tủ sách thành công!");
      callback();
    } catch (error) {
      handleApiError({ error, toastMessage: "Cập nhật tủ sách thất bại!" });
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
                Tên tủ sách <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên tủ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vị trí</FormLabel>
              <FormControl>
                <Input placeholder="Nhập vị trí tủ" {...field} />
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
