"use client"

import { createUser } from "@/api/wielloUser/action";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function Register() {
    const router = useRouter();
    const [registerState, registerAction, registerPending] = useActionState(createUser, {});

    useEffect(() => {
        if (getCookie("token")) {
            router.push("/");
        }
    }, [])

    useEffect(() => {
        if (registerState.message) {
            toast.success(registerState.message);
        } else if (registerState.error) {
            toast.error(registerState.error);
        }
    }, [registerState])

    return (
        <main className="flex flex-auto items-center justify-center">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>
                        Register
                    </CardTitle>
                    <CardTitle>
                        Create your account!
                    </CardTitle>
                    <CardAction>
                        <Button variant="link" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                    </CardAction>
                </CardHeader>
                <form action={registerAction}>
                    <CardContent className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" minLength={6} maxLength={50} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input id="email" type="email" name="email" required maxLength={100} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" name="password" required minLength={8} maxLength={50} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm password</Label>
                            <Input id="confirmPassword" type="password" name="confirmPassword" required />
                        </div>
                    </CardContent>
                    <CardFooter className="mt-6">
                        <Button disabled={registerPending} className="w-full" variant="default" type="submit">Register</Button>
                    </CardFooter>
                </form>
            </Card>
        </main>
    )
}