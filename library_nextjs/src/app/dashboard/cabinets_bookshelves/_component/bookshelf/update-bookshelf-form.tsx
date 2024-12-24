"use client";

import bookshelfApiRequests from "@/apiRequests/bookshelf";
import { ComboboxCabinet } from "@/app/dashboard/cabinets_bookshelves/_component/bookshelf/combobox-cabinet";
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
  CreateBookshelfBody,
  CreateBookshelfBodyType,
} from "@/schemaValidations/bookshelf.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateBookshelfForm({
  id,
  callback,
}: {
  id: string;
  callback: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [cabinetValue, setCabinetValue] = useState<string>("");

  const form = useForm<CreateBookshelfBodyType>({
    resolver: zodResolver(CreateBookshelfBody),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (cabinetValue) {
      form.setValue("cabinetId", cabinetValue);
      form.trigger("cabinetId");
    } else form.setValue("cabinetId", "");
  }, [cabinetValue, form]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { payload } = await bookshelfApiRequests.get(id);
        form.setValue("name", payload.name);
        if (payload.cabinetId) {
          setCabinetValue(payload.cabinetId);
          form.setValue("cabinetId", payload.cabinetId);
        }
      } catch (error) {
        handleApiError({
          error,
          toastMessage: "Tải dữ liệu ngăn sách thất bại!",
        });
      }
    };
    fetchCategory();
  }, [form, id]);

  async function onSubmit(values: CreateBookshelfBodyType) {
    try {
      setLoading(true);
      await bookshelfApiRequests.update(id, values);
      toast.success("Cập nhật ngăn sách thành công!");
      callback();
    } catch (error) {
      handleApiError({ error, toastMessage: "Cập nhật ngăn sách thất bại!" });
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
                Tên ngăn sách <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên ngăn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cabinetId"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Tủ sách</FormLabel>
              <FormControl>
                <Input
                  className="hidden"
                  placeholder="Nhập vị trí tủ"
                  onChange={(e) => {
                    onChange(e);
                  }}
                  {...fieldProps}
                />
              </FormControl>
              <ComboboxCabinet
                value={cabinetValue}
                setValue={setCabinetValue}
              />
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
