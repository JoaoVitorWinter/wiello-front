"use server"

import { cookies } from "next/headers";
import { customAxios } from "../axios"

export const getTask = async (token: string, taskID: string) => {
    try {
        const response = await customAxios.get(`/task/${taskID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const cookieStore = await cookies();
        cookieStore.set("token", response.headers.revalidatedtoken);
        return {
            task: response.data as Task
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        return {
            error: "Error trying to get your task. Try again later..."
        }
    }
}

export const createTask = async (previousState: any, formData: FormData): Promise<any> => {
    const rawFormData = Object.fromEntries(formData);
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
        if (!token) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        const response = await customAxios.post(`/task/${rawFormData.projectColumnID}`, {
            title: rawFormData.title,
            description: rawFormData.description,
            deadline: rawFormData.deadline
        }, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });
        cookieStore.set("token", response.headers.revalidatedtoken);
        return {
            message: "Task successfully created!"
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        return {
            error: error.response.data ? error.response.data : "Error trying to create the task. Try again later..."
        }
    }
}

export const deleteTask = async (id: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
        if (!token) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        const response = await customAxios.delete(`/task/${id}`, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        })
        cookieStore.set("token", response.headers.revalidatedtoken);
        return {
            message: "Task deleted..."
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        return {
            error: error.response.data ? error.response.data : "Error trying to delete the task. Try again later..."
        }
    }
}

export const editTask = async (previousState: any, formData: FormData): Promise<any> => {
    const rawFormData = Object.fromEntries(formData);
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
        if (!token) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        const response = await customAxios.put(`/task/${rawFormData.taskID}`, {
            title: rawFormData.title,
            description: rawFormData.description,
            deadline: rawFormData.deadline
        }, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        })
        cookieStore.set("token", response.headers.revalidatedtoken);
        return {
            message: `Task edited...`
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        return {
            error: error.response.data ? error.response.data : "Error trying to edit the task. Try again later..."
        }
    }
}

export const editTaskColumn = async (taskID: string, projectColumnID: string): Promise<any> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
        if (!token) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        const response = await customAxios.patch(`/task/${taskID}/${projectColumnID}`, {}, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        })
        cookieStore.set("token", response.headers.revalidatedtoken);
        return {
            message: `Task edited...`
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        return {
            error: error.response.data ? error.response.data : "Error trying to edit the task. Try again later..."
        }
    }
}