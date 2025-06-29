"use client"

import { createProject, deleteProject, editProjectName, getAllProjects } from "@/api/project/action";
import { logout } from "@/api/wielloUser/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import { getCookie } from "cookies-next";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [createProjectState, createProjectAction, createProjectPending] = useActionState(createProject, {});
  const [editProjectNameState, editProjectNameAction, editProjectNamePending] = useActionState(editProjectName, {});
  const [projects, setProjects] = useState<Array<SimpleProject>>();

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
      return;
    }

    getData(token.toString());

  }, [])

  useEffect(() => {
    if (createProjectState.error) {
      if (createProjectState.error === "TOKEN_ERROR") {
        logout();
      } else {
        toast.error(createProjectState.error);
      }
    } else if (createProjectState.message) {
      toast.success(createProjectState.message);
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
      } else {
        getData(token.toString());
      }
    }
  }, [createProjectState])

  useEffect(() => {
    if (editProjectNameState.error) {
      if (editProjectNameState.error === "TOKEN_ERROR") {
        logout();
      } else {
        toast.error(editProjectNameState.error);
      }
    } else if (editProjectNameState.message) {
      toast.success(editProjectNameState.message);
      const token = getCookie("token");
      if (!token) {
        router.push("/login");
      } else {
        getData(token.toString());
      }
    }
  }, [editProjectNameState]);



  const getData = async (token: string) => {
    const response = await getAllProjects(token);
    if (response.error) {
      if (response.error === "TOKEN_ERROR") {
        logout();
      } else {
        toast.error(response.error);
      }
    } else {
      setProjects(response.projects);
    }
  }

  return (
    <main>
      <form action={createProjectAction} className="flex flex-col sm:flex-row gap-2 m-auto px-2 pt-8 max-w-sm">
        <Input placeholder="Name of the new project" required maxLength={50} name="name" />
        <Button disabled={createProjectPending}>Create project</Button>
      </form>
      <section className="flex flex-wrap justify-center items-center gap-8 py-10 px-4">
        {projects && projects.map((project) => {
          return (
            <Card key={project.id} className="pt-0 w-72 transition-all hover:scale-105">
              <CardHeader className="bg-muted h-10 z-0 rounded-t-[inherit]">
              </CardHeader>
              <CardContent className="flex justify-between items-center gap-4">
                <Link href={`/project/${project.id}`}><CardDescription className="break-words truncate flex-auto underline">{project.name}</CardDescription></Link>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Pencil className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent aria-describedby={undefined}>
                      <DialogHeader>
                        <DialogTitle>Edit the name of the project</DialogTitle>
                      </DialogHeader>
                      <form action={editProjectNameAction}>
                        <DialogFooter>
                          <Input maxLength={50} required name="name" className="order-1 sm:order-none" />
                          <Input readOnly type="hidden" name="id" value={project.id} required />
                          <DialogClose asChild>
                            <Button disabled={editProjectNamePending} type="submit">
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
                          This project will be deleted. This action cannot be undone!
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={async () => {
                            const response = await deleteProject(project.id);
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
          );
        })}
      </section>
    </main>
  );
}
