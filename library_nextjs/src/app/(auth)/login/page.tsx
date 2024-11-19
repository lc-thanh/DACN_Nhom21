import { LoginForm } from "@/app/(auth)/login/login-form";

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-center mb-5">Đăng nhập</h1>
      <div className="flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
