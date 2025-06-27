'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { signupUser } from '@/lib/auth';
import { Button } from "@/components/ui/button";
import {
  Card, CardAction, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import "@/styles/auth.css";

// Validation schema
const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  repeatPassword: z.string().min(6, "Repeat password is required"),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords do not match",
  path: ["repeatPassword"],
});

const SignUpPage: React.FC = () => {
  const router = useRouter();

  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const result = signUpSchema.safeParse(form);
    if (!result.success) {
      const firstError = result.error.issues[0]?.message || "Invalid input";
      setFormError(firstError);
      return;
    }

    try {
      await signupUser(
        `${form.firstName} ${form.lastName}`,
        form.email,
        form.password
      );
      router.push('/dashboard');
    } catch (error: any) {
      setFormError(error.message);
    }
  };

  return (
    <div className="split-layout-container">
      <div className="split-layout-card-section">
        <Card className="w-full max-w-sm split-layout-the-card">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create an account</CardDescription>
            <CardAction>
              <Link href="/login">
                <Button variant="link">Login</Button>
              </Link>
            </CardAction>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              {formError && (
                <div className="mb-4 text-sm text-red-500 text-center">
                  {formError}
                </div>
              )}
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repeatPassword">Repeat Password</Label>
                  <Input
                    id="repeatPassword"
                    name="repeatPassword"
                    type="password"
                    value={form.repeatPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">Sign up</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <div className="split-layout-image-section">
        <img
          src="/23236.jpg"
          alt="Background"
          className="split-layout-background-image"
        />
        <div className="split-layout-image-text">
          Turn chaos into clarity—take control of your day, one task at a time.
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
