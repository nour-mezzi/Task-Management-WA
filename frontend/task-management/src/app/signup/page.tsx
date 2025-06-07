'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import "@/styles/auth.css";

const SignUpPage: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Attempting Sign Up:', {
            firstName,
            lastName,
            email,
            password,
            repeatPassword,
        });
    };

    return (
        <div className="split-layout-container">
            <div className="split-layout-card-section">
                <Card className="w-full max-w-sm split-layout-the-card">
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>create an account</CardDescription>
                        <CardAction>
                             <Link href="/login" >
                                <Button variant="link" >Login</Button>
                            </Link>
                        </CardAction>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First Name</Label>
                                    <Input
                                        id="first-name"
                                        type="text"
                                        placeholder="first name"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input
                                        id="last-name"
                                        type="text"
                                        placeholder="last name"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="re-password">Repeat Password</Label>
                                    </div>
                                    <Input
                                        id="re-password"
                                        type="password"
                                        placeholder="repeat password"
                                        required
                                        value={repeatPassword}
                                        onChange={(e) => setRepeatPassword(e.target.value)}
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