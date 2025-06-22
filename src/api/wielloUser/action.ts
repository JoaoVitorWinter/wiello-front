"use server"

import { customAxios } from "../axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const createUser = async (previousState: any, formData: FormData): Promise<any> => {
    const rawFormData = Object.fromEntries(formData);

    if (rawFormData.password != rawFormData.confirmPassword) {
        return {
            error: "Passwords don't match!"
        };
    }

    try {
        await customAxios.post('/user', {
            username: rawFormData.username,
            email: rawFormData.email,
            password: rawFormData.password,
        });
        return {
            message: "User created! You can now login into the Wiello app."
        };
    } catch (error: any) {
        return {
            error: error.response.data ? error.response.data : "Error trying to create user. Try again later..."
        };
    }
}

export const loginUser = async (previousSate: any, formData: FormData): Promise<any> => {
    const rawFormData = Object.fromEntries(formData);


    try {
        const response = await customAxios.post("/user/login", {
            username: rawFormData.username,
            password: rawFormData.password
        })
        const cookieStore = await cookies();
        cookieStore.set("token", response.data)
        return {
            message: `Logged as ${rawFormData.username}!`
        }
    } catch (error: any) {
        return {
            error: error.response.status == 400 ? "Invalid credentials! Try again..." : "Something went wrong trying to login..."
        };
    }
}

export const logout = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("token");
    redirect("/login");
} 