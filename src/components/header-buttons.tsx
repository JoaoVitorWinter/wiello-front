"use client"

import { getCookie } from "cookies-next"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button";
import Link from "next/link";
import { logout } from "@/api/wielloUser/action";
import { useEffect, useState } from "react";

export function HeaderButtons() {
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        setIsLogged(!getCookie("token"));
    })

    return (
        <div className="flex items-center gap-2">
            {isLogged ?
                <>
                    <Button variant={"outline"} asChild><Link href={"/register"}>Register</Link></Button>
                    <Button variant={"outline"}><Link href={"/login"}>Login</Link></Button>
                </> :
                <Button variant={"outline"} onClick={logout}>Logout</Button>}
            <ModeToggle />
        </div>
    )
}