import { SignupForm } from "@/app/(auth)/signup/signup-form";

export default function SignupPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-center mb-5">Đăng ký</h1>
      <div className="flex justify-center">
        <SignupForm />
      </div>
    </div>
  );
}
