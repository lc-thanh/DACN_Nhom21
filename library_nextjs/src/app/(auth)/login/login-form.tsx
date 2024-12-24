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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import authApiRequests from "@/apiRequests/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { handleApiError } from "@/lib/utils";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("redirectFrom")) {
      toast.info("Bạn cần đăng nhập để tiếp tục");
    }
  }, [searchParams]);

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
      router.push("/dashboard");
    } catch (error: any) {
      handleApiError({
        error,
        toastMessage: "Có lỗi xảy ra trong quá trình đăng nhập",
        setErrorForm: form.setError,
      });
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
          // description={"Quên mật khẩu?"}
        />

        <Button type="submit" className="!mt-8 w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
}
