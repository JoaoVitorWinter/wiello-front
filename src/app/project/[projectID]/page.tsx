'use client'

import { getProject } from "@/api/project/action";
import { createProjectColumn, deleteProjectColumn, editProjectColumnName } from "@/api/projectColumn/action";
import { createTask, deleteTask, editTask, editTaskColumn, getTask } from "@/api/task/action";
import { logout } from "@/api/wielloUser/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getCookie } from "cookies-next";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Project({ params }: { params: { projectID: string } }) {
    const projectID = (use(params as any) as any).projectID;
    const [createTaskState, createTaskAction, createTaskPending] = useActionState(createTask, {});
    const [editTaskState, editTaskAction, editTaskPending] = useActionState(editTask, {});
    const [createProjectColumnState, createProjectColumnAction, createProjectColumnPending] = useActionState(createProjectColumn, {});
    const [editProjectColumnNameState, editProjectColumnNameAction, editProjectColumnNamePending] = useActionState(editProjectColumnName, {});
    const router = useRouter();
    const [project, setProject] = useState<Project>();
    const [selectedTask, setSelectedTask] = useState<Task>();

    useEffect(() => {
        const token = getCookie("token");
        if (!token) {
            router.push("/login");
            return;
        }

        getData(token.toString());

    }, []);

    useEffect(() => {
        if (createTaskState.error) {
            if (createTaskState.error === "TOKEN_ERROR") {
                logout();
            } else {
                toast.error(createTaskState.error);
            }
        } else if (createTaskState.message) {
            toast.success(createTaskState.message);
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
            } else {
                getData(token.toString());
            }
        }
    }, [createTaskState]);

    useEffect(() => {
        if (editTaskState.error) {
            if (editTaskState.error === "TOKEN_ERROR") {
                logout();
            } else {
                toast.error(editTaskState.error);
            }
        } else if (editTaskState.message) {
            toast.success(editTaskState.message);
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
            } else {
                getData(token.toString());
            }
        }
    }, [editTaskState]);

    useEffect(() => {
        if (createProjectColumnState.error) {
            if (createProjectColumnState.error === "TOKEN_ERROR") {
                logout();
            } else {
                toast.error(createProjectColumnState.error);
            }
        } else if (createProjectColumnState.message) {
            toast.success(createProjectColumnState.message);
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
            } else {
                getData(token.toString());
            }
        }
    }, [createProjectColumnState]);

    useEffect(() => {
        if (editProjectColumnNameState.error) {
            if (editProjectColumnNameState.error === "TOKEN_ERROR") {
                logout();
            } else {
                toast.error(editProjectColumnNameState.error);
            }
        } else if (editProjectColumnNameState.message) {
            toast.success(editProjectColumnNameState.message);
            const token = getCookie("token");
            if (!token) {
                router.push("/login");
            } else {
                getData(token.toString());
            }
        }
    }, [editProjectColumnNameState]);


    const getData = async (token: string) => {
        const response = await getProject(token, projectID);
        if (response.error) {
            if (response.error === "TOKEN_ERROR") {
                logout();
            } else {
                toast.error(response.error);
            }
        } else {
            setProject(response.project);
        }
    }

    return (
        <main className="flex flex-col gap-4 flex-auto w-full pb-4  px-4 sm:px-8">
            {project &&
                <>
                    <h1 className="w-full text-2xl sm:text-4xl font-bold">{project.name}</h1>
                    <div className="flex gap-2 flex-auto overflow-auto">
                        {project.columns.map((column) =>
                        (<Card key={column.id} className="min-w-72 max-w-72 h-fit">
                            <CardHeader>
                                <div className="flex justify-between items-center gap-4">

                                    <CardTitle className="text-center">{column.name}</CardTitle>
                                    <div className="flex gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Pencil className="cursor-pointer" />
                                            </DialogTrigger>
                                            <DialogContent aria-describedby={undefined}>
                                                <DialogHeader>
                                                    <DialogTitle>Edit the name of the list</DialogTitle>
                                                </DialogHeader>
                                                <form action={editProjectColumnNameAction}>
                                                    <DialogFooter>
                                                        <Input maxLength={30} required name="name" className="order-1 sm:order-none" />
                                                        <Input readOnly type="hidden" name="id" value={column.id} required />
                                                        <DialogClose asChild>
                                                            <Button disabled={editProjectColumnNamePending} type="submit">
                                                                Edit
                                                            </Button>
                                                        </DialogClose>
                                                        <DialogClose asChild>
                                                            <Button type="button" variant={"outline"}>
                                                                Cancel
                                                            </Button>
                                                        </DialogClose>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Trash className="cursor-pointer" />
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                    <DialogDescription>
                                                        This list will be deleted. This action cannot be undone!
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button onClick={async () => {
                                                            const response = await deleteProjectColumn(column.id);
                                                            if (response.error) {
                                                                if (response.error === "TOKEN_ERROR") {
                                                                    logout();
                                                                } else {
                                                                    toast.error(response.error);
                                                                }
                                                            } else {
                                                                toast.success(response.message);
                                                                const token = getCookie("token");
                                                                if (!token) {
                                                                    router.push("/login");
                                                                } else {
                                                                    getData(token.toString());
                                                                }
                                                            }
                                                        }} variant="destructive">Delete</Button>
                                                    </DialogClose>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Separator />
                                <div className="mt-6 flex flex-col w-full gap-2 overflow-auto">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button>Create new task</Button>
                                        </DialogTrigger>
                                        <DialogContent aria-describedby={undefined}>
                                            <DialogHeader>
                                                <DialogTitle>Create task in '{column.name}'</DialogTitle>
                                            </DialogHeader>
                                            <form action={createTaskAction} className="flex flex-col gap-4">
                                                <Input readOnly hidden value={column.id} name="projectColumnID" required />
                                                <div className="grid gap-2">
                                                    <Label htmlFor="title">Name</Label>
                                                    <Input id="title" name="title" maxLength={100} required />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="description">Description</Label>
                                                    <Textarea id="description" name="description" maxLength={500} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="deadline">Deadline</Label>
                                                    <Input id="deadline" name="deadline" type="date" />
                                                </div>
                                                <DialogClose asChild>
                                                    <Button type="submit" disabled={createTaskPending}>Create task</Button>
                                                </DialogClose>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                    {column.tasks.map((task) => (
                                        <Dialog key={task.id}>
                                            <Card>
                                                <CardContent className="flex justify-between items-center gap-4">
                                                    <DialogTrigger asChild >
                                                        <CardTitle onClick={async () => {
                                                            setSelectedTask(undefined);
                                                            let token = getCookie("token");
                                                            if (!token) {
                                                                router.push("/login");
                                                                return;
                                                            }
                                                            const response = await getTask(token.toString(), task.id);
                                                            if (response.error) {
                                                                if (response.error === "TOKEN_ERROR") {
                                                                    logout();
                                                                } else {
                                                                    toast.error(response.error);
                                                                }
                                                            } else {
                                                                setSelectedTask(response.task);
                                                            }
                                                        }} className="text-sm font-light break-words truncate cursor-pointer">{task.title}</CardTitle>
                                                    </DialogTrigger>
                                                    <div className="flex gap-2">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger>
                                                                <Pencil className="cursor-pointer" />
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {project.columns.map((column) => (
                                                                    <DropdownMenuItem key={column.id} onClick={async () => {
                                                                        const response = await editTaskColumn(task.id, column.id);
                                                                        if (response.error) {
                                                                            if (response.error === "TOKEN_ERROR") {
                                                                                logout();
                                                                            } else {
                                                                                toast.error(response.error);
                                                                            }
                                                                        } else {
                                                                            let token = getCookie("token");
                                                                            if (!token) {
                                                                                router.push("/login");
                                                                            } else {
                                                                                getData(token.toString());
                                                                            }
                                                                        }
                                                                    }}>
                                                                        {column.name}
                                                                    </DropdownMenuItem>
                                                                ))}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Trash className="cursor-pointer" />
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                                    <DialogDescription>
                                                                        This task will be deleted. This action cannot be undone!
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <DialogClose asChild>
                                                                        <Button onClick={async () => {
                                                                            const response = await deleteTask(task.id);
                                                                            if (response.error) {
                                                                                if (response.error === "TOKEN_ERROR") {
                                                                                    logout();
                                                                                } else {
                                                                                    toast.error(response.error);
                                                                                }
                                                                            } else {
                                                                                toast.success(response.message);
                                                                                const token = getCookie("token");
                                                                                if (!token) {
                                                                                    router.push("/login");
                                                                                } else {
                                                                                    getData(token.toString());
                                                                                }
                                                                            }
                                                                        }} variant="destructive">Delete</Button>
                                                                    </DialogClose>
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline">Cancel</Button>
                                                                    </DialogClose>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                            {selectedTask &&
                                                <DialogContent aria-describedby={undefined}>
                                                    <DialogHeader>
                                                        <DialogTitle className="max-w-4/6">Your task</DialogTitle>
                                                    </DialogHeader>
                                                    <form action={editTaskAction} className="flex flex-col gap-4">
                                                        <Input readOnly hidden value={task.id} name="taskID" required />
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="title">Name</Label>
                                                            <Input id="title" name="title" maxLength={100} required defaultValue={selectedTask.title} />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="description">Description</Label>
                                                            <Textarea id="description" name="description" maxLength={500} defaultValue={selectedTask.description} />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label htmlFor="deadline">Deadline</Label>
                                                            <Input id="deadline" name="deadline" type="date" defaultValue={selectedTask.deadline ? new Date(selectedTask.deadline).toISOString().split('T')[0] : ""} />
                                                        </div>
                                                        <DialogClose asChild>
                                                            <Button type="submit" disabled={editTaskPending}>Edit task</Button>
                                                        </DialogClose>
                                                    </form>
                                                </DialogContent>
                                            }
                                        </Dialog>
                                    ))}

                                </div>
                            </CardContent>
                        </Card>))}
                        <Card className="min-w-72 max-w-72 h-fit">
                            <CardContent>
                                <form action={createProjectColumnAction} className="flex flex-col gap-2">
                                    <Input hidden readOnly value={projectID} name="projectID" required />
                                    <Input maxLength={30} placeholder="Name of the new list" name="name" required />
                                    <Button className="w-full" type="submit" disabled={createProjectColumnPending}>Create list</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </>}
        </main >
    )
}