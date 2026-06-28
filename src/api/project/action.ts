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

export const getProject = async (token: string, projectID: string) => {
    try {
        const response = await customAxios.get(`/project/${projectID}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const cookieStore = await cookies();
        cookieStore.set("token", response.headers.revalidatedtoken);
        return {
            project: response.data as Project
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        return {
            error: "Error trying to get your project. Try again later..."
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

export const deleteProject = async (id: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
        if (!token) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        const response = await customAxios.delete(`/project/${id}`, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        })
        cookieStore.set("token", response.headers.revalidatedtoken);
        return {
            message: "Project deleted..."
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        return {
            error: error.response.data ? error.response.data : "Error trying to delete the project. Try again later..."
        }
    }
}

export const editProjectName = async (previousState: any, formData: FormData): Promise<any> => {
    const rawFormData = Object.fromEntries(formData);
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token");
        if (!token) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        const response = await customAxios.put(`/project/${rawFormData.id}`, {
            name: rawFormData.name
        }, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        })
        cookieStore.set("token", response.headers.revalidatedtoken);
        return {
            message: `Name of the project was edited to ${rawFormData.name}`
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            return {
                error: "TOKEN_ERROR"
            }
        }
        return {
            error: error.response.data ? error.response.data : "Error trying to edit the project's name. Try again later..."
        }
    }
}