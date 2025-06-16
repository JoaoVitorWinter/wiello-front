"use client"

import { ModeToggle } from "./mode-toggle"


export function Header() {
    return (
        <header className="w-screen p-2 flex justify-between items-center">
            <h1>Wiello</h1>
            <ModeToggle />
        </header>
    )
}