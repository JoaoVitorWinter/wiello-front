"use client"

import { loginUser } from "@/api/wielloUser/action";
import { getCookie } from 'cookies-next'
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function Register() {
    const router = useRouter();
    const [loginState, loginAction, loginPending] = useActionState(loginUser, {});

    useEffect(() => {
        if (getCookie("token")) {
            router.push("/");
        }
    }, [])

    useEffect(() => {
        if (loginState.message) {
            toast.success(loginState.message);
            router.push("/");
        } else if (loginState.error) {
            toast.error(loginState.error);
        }
    }, [loginState]);

    return (
        <main className="flex flex-auto items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>
                        Login
                    </CardTitle>
                    <CardTitle>
                        Enter your credentials!
                    </CardTitle>
                    <CardAction>
                        <Button variant="link" asChild>
                            <Link href="/register">Register</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <form action={loginAction}>
                    <CardContent className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" name="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="mt-6">
                        <Button disabled={loginPending} className="w-full" variant="default" type="submit">Login</Button>
                    </CardFooter>
                </form>
            </Card>
        </main>
    )
}