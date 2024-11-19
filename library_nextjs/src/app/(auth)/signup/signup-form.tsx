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
import {
  RegisterBody,
  RegisterBodyType,
} from "@/schemaValidations/auth.schema";
import { PasswordField } from "@/components/ui/password-input";
import authApiRequests from "@/apiRequests/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterBodyType>({
    resolver: zodResolver(RegisterBody),
    defaultValues: {
      fullName: "",
      individualId: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterBodyType) {
    setLoading(true);
    try {
      await authApiRequests.register(values);

      toast.success("Đăng ký thành công!");
      router.push("/me");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const status = error.status as number;
      if (status === 409) {
        const payload = error.payload as {
          field: string;
          message: string;
        };
        form.setError(payload.field as "phone" | "individualId", {
          type: "manual",
          message: payload.message,
        });
        toast.error(payload.message);
      } else {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau!");
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
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Họ và tên <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Nhập họ và tên" {...field} />
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
                <Input placeholder="Nhập mã sinh viên/giảng viên" {...field} />
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

        <PasswordField
          // description={<Link href="reset">Forgot your password?</Link>}
          name="password"
          label={
            <span>
              Mật khẩu <span className="text-destructive">*</span>
            </span>
          }
          placeholder="Nhập mật khẩu"
          // description={"Forgot your password?"}
        />

        <PasswordField
          // description={<Link href="reset">Forgot your password?</Link>}
          name="confirmPassword"
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu"
          // description={"Forgot your password?"}
        />

        <Button type="submit" className="!mt-8 w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          Đăng ký
        </Button>
      </form>
    </Form>
  );
}
