"use server"

import { cookies } from "next/headers";
import { customAxios } from "../axios"

export const createProjectColumn = async (previousState: any, formData: FormData): Promise<any> => {
    const rawFormData = Object.fromEntries(formData);
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
        if (!token) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        const response = await customAxios.post(`/column/${rawFormData.projectID}`, {
            name: rawFormData.name
        }, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });
        cookieStore.set("token", response.headers.revalidatedtoken);
        return {
            message: "List successfully created!"
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        return {
            error: error.response.data ? error.response.data : "Error trying to create the list. Try again later..."
        }
    }
}

export const deleteProjectColumn = async (id: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
        if (!token) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        const response = await customAxios.delete(`/column/${id}`, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        })
        cookieStore.set("token", response.headers.revalidatedtoken);
        return {
            message: "List deleted..."
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        return {
            error: error.response.data ? error.response.data : "Error trying to delete the list. Try again later..."
        }
    }
}

export const editProjectColumnName = async (previousState: any, formData: FormData): Promise<any> => {
    const rawFormData = Object.fromEntries(formData);
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
        if (!token) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        const response = await customAxios.patch(`/column/${rawFormData.id}`, {
            name: rawFormData.name
        }, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        })
        cookieStore.set("token", response.headers.revalidatedtoken);
        return {
            message: `List edited...`
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        return {
            error: error.response.data ? error.response.data : "Error trying to edit the list. Try again later..."
        }
    }
}