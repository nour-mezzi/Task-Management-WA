'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from 'zod';

import "@/styles/auth.css";

// Schema definition using Zod
const signUpSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    repeatPassword: z.string().min(6, "Repeat password is required"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

const SignUpPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const result = signUpSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      repeatPassword,
    });

    if (!result.success) {
      const firstIssue = result.error.issues[0]?.message || "Invalid input";
      setFormError(firstIssue);
      return;
    }

    console.log('Attempting Sign Up:', {
      firstName,
      lastName,
      email,
      password,
    });

    // TODO: Call your sign-up API here
  };

  return (
    <div className="split-layout-container">
      <div className="split-layout-card-section">
        <Card className="w-full max-w-sm split-layout-the-card">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create an account</CardDescription>
            <CardAction>
              <Link href="/login" legacyBehavior>
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
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    type="text"
                    placeholder="first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    type="text"
                    placeholder="last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="re-password">Repeat Password</Label>
                  <Input
                    id="re-password"
                    type="password"
                    placeholder="repeat password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="split-layout-image-section">
        <img
          src="/23236.jpg"
          alt="Your Background Image"
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
