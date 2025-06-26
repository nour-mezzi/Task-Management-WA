'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';

import { useAuthStore } from '@/stores/userStore';
import '@/styles/auth.css';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      setFormError(result.error.issues[0]?.message || 'Invalid input');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setFormError(errorData.message || 'Login failed');
        return;
      }

      const data = await res.json();

      // Save JWT token to Zustand + localStorage
      setToken(data.token);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      setFormError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="split-layout-container">
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

      <div className="split-layout-card-section">
        <Card className="w-full max-w-sm split-layout-the-card">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email and password below to login to your account
            </CardDescription>
            <CardAction>
              <Link href="/signup">
                <Button variant="link">Sign Up</Button>
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
              </div>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
