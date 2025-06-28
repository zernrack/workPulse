"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { signupAction } from "@/app/actions/auth";
import { Eye, EyeOff, Mail, Lock, User, UserCheck, Zap } from "lucide-react";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { execute, isExecuting, result } = useAction(signupAction);

  // Show toast for server errors - trigger on each result change
  useEffect(() => {
    if (result?.serverError) {
      toast.error(result.serverError);
    }
  }, [result]); // Changed dependency to entire result object

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    execute(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md flex items-center flex-col">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Work Pulse</h1>
          <p className="text-blue-100">Your productivity companion</p>
        </div>

        <Card className="shadow-2xl md:w-2xl border-0 backdrop-blur-sm bg-white/95">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900">
              Create your account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Join Work Pulse and start tracking your productivity
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700"
                  >
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {result?.validationErrors?.firstName?._errors?.[0] && (
                    <p className="text-sm text-destructive">
                      {result.validationErrors.firstName._errors[0]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  {result?.validationErrors?.lastName?._errors?.[0] && (
                    <p className="text-sm text-destructive">
                      {result.validationErrors.lastName._errors[0]}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="userName"
                  className="text-sm font-medium text-gray-700"
                >
                  Username
                </Label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="userName"
                    name="userName"
                    placeholder="greatguy123"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                {result?.validationErrors?.userName?._errors?.[0] && (
                  <p className="text-sm text-destructive">
                    {result.validationErrors.userName._errors[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                {result?.validationErrors?.email?._errors?.[0] && (
                  <p className="text-sm text-destructive">
                    {result.validationErrors.email._errors[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {result?.validationErrors?.password?._errors?.[0] && (
                  <p className="text-sm text-destructive">
                    {result.validationErrors.password._errors[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                {result?.validationErrors?.confirmPassword?._errors?.[0] && (
                  <p className="text-sm text-destructive">
                    {result.validationErrors.confirmPassword._errors[0]}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 mt-4">
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                disabled={isExecuting}
              >
                {isExecuting
                  ? "Creating account..."
                  : "Create Work Pulse account"}
              </Button>
            </CardFooter>
          </form>

          <div className="px-6 pb-6">
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>

        <div className="text-center mt-8">
          <p className="text-xs text-blue-100 inline-flex items-center gap-2">
            2024 Work Pulse. Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
}
