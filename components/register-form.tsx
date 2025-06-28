"use client";

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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                {result?.validationErrors?.firstName?._errors?.[0] && (
                  <p className="text-sm text-destructive">
                    {result.validationErrors.firstName._errors[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
                {result?.validationErrors?.lastName?._errors?.[0] && (
                  <p className="text-sm text-destructive">
                    {result.validationErrors.lastName._errors[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                name="userName"
                placeholder="greatguy123"
                value={formData.userName}
                onChange={handleInputChange}
                required
              />
              {result?.validationErrors?.userName?._errors?.[0] && (
                <p className="text-sm text-destructive">
                  {result.validationErrors.userName._errors[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              {result?.validationErrors?.email?._errors?.[0] && (
                <p className="text-sm text-destructive">
                  {result.validationErrors.email._errors[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {result?.validationErrors?.password?._errors?.[0] && (
                <p className="text-sm text-destructive">
                  {result.validationErrors.password._errors[0]}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {result?.validationErrors?.confirmPassword?._errors?.[0] && (
                <p className="text-sm text-destructive">
                  {result.validationErrors.confirmPassword._errors[0]}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showPasswords"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="showPasswords" className="text-sm text-gray-700">
                Show passwords
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isExecuting}
            >
              {isExecuting ? "Creating Account..." : "Create Account"}
            </Button>
          </CardFooter>
        </form>
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
