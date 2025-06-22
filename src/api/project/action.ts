"use server"

import { cookies } from "next/headers";
import { customAxios } from "../axios"


export const getAllProjects = async (token: string) => {
    try {
        const response = await customAxios.get("/project", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const cookieStore = await cookies();
        cookieStore.set("token", response.headers.revalidatedtoken);
        return {
            projects: response.data as Array<SimpleProject>
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        return {
            error: "Error trying to get your projects. Try again later..."
        }
    }
}

export const createProject = async (previousState: any, formData: FormData): Promise<any> => {
    const rawFormData = Object.fromEntries(formData);
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
        if (!token) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        const response = await customAxios.post("/project", {
            name: rawFormData.name
        }, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });
        cookieStore.set("token", response.headers.revalidatedtoken);
        return {
            message: "Project successfully created!"
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        return {
            error: error.response.data ? error.response.data : "Error trying to create the project. Try again later..."
        }
    }
}