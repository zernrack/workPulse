// app/register/page.tsx
import { RegisterForm } from "@/components/register-form";
import React from "react";

function RegisterPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
