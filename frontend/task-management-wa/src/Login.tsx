import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import myBackgroundImage from "@/components/23236.jpg"; // Import the image file
import './styles/login.css'

const LoginPage: React.FC = () => {
    return (
        <div className="split-layout-container">

            <div className="split-layout-image-section">
                <img
                    src={myBackgroundImage} // Use the variable holding the public URL
                    alt="Image not showing"
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
                        <CardDescription>Enter your email and password below to login to your account</CardDescription>
                        <CardAction>
                            <Button variant="link">Sign Up</Button>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="m@example.com" required />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <Input id="password" type="password" placeholder="password" required />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="w-full">Login</Button>
                    </CardFooter>
                </Card>
            </div>

        </div>
    );
};

export default LoginPage;