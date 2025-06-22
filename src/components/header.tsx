import Link from "next/link"
import { HeaderButtons } from "./header-buttons"


export function Header() {
    return (
        <header className="w-full p-4 flex justify-between items-center">
            <Link href={"/"}><h1>Wiello</h1></Link>
            <HeaderButtons />
        </header>
    )
}