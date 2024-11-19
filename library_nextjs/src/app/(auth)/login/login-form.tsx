"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { PasswordField } from "@/components/ui/password-input";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import authApiRequests from "@/apiRequests/auth";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginBodyType) {
    setLoading(true);
    try {
      await authApiRequests.login(values);

      toast.success("Đăng nhập thành công!");
      router.push("/me");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const payload = error.payload as {
        field: string;
        message: string;
      };
      const status = error.status as number;

      if (status === 401) {
        form.setError(payload.field as "phone" | "password", {
          type: "server",
          message: payload.message,
        });
        toast.error(payload.message);
      } else {
        toast.error("Có lỗi xảy ra trong khi đăng nhập");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 max-w-[450px] w-full"
      >
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

        <PasswordField
          name="password"
          label={
            <span>
              Mật khẩu <span className="text-destructive">*</span>
            </span>
          }
          placeholder="Nhập mật khẩu"
          description={"Quên mật khẩu?"}
        />

        <Button type="submit" className="!mt-8 w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}