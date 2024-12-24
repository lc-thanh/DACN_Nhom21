"use client";

import staffApiRequests from "@/apiRequests/staff";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group";
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
  CreateStaffBody,
  CreateStaffBodyType,
} from "@/schemaValidations/staff.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MonitorCog, NotebookPen } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateStaffForm({
  callback,
}: {
  callback: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CreateStaffBodyType>({
    resolver: zodResolver(CreateStaffBody),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
    },
  });

  async function onSubmit(values: CreateStaffBodyType) {
    try {
      setLoading(true);
      await staffApiRequests.create(values);
      toast.success("Tạo nhân sự mới thành công!");
      callback();
    } catch (error) {
      handleApiError({
        error,
        toastMessage: "Tạo nhân sự mới thất bại!",
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
                <Input placeholder="Nhập họ và tên" {...field} />
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
                <Input placeholder="Nhập số điện thoại" {...field} />
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
                <Input placeholder="Nhập email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vai trò</FormLabel>
              <FormControl>
                <ButtonGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row"
                >
                  <FormItem>
                    <FormControl>
                      <ButtonGroupItem
                        icon={<NotebookPen size={20} />}
                        value="Librarian"
                        label="Thủ thư"
                        noIndicator={true}
                        className="text-primary hover:text-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                      />
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <ButtonGroupItem
                        icon={<MonitorCog size={20} />}
                        value="Admin"
                        label="Quản trị"
                        noIndicator={true}
                        className="text-primary hover:text-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white"
                      />
                    </FormControl>
                  </FormItem>
                </ButtonGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="!mt-8 w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Thêm
        </Button>
      </form>
    </Form>
  );
}
