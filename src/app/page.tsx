"use client"

import { createProject, getAllProjects } from "@/api/project/action";
import { logout } from "@/api/wielloUser/action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCookie } from "cookies-next";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [createProjectState, createProjectAction, createProjectPending] = useActionState(createProject, {});
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
      window.location.reload();
    }
  }, [createProjectState])

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
                <CardDescription className="break-words truncate flex-auto">{project.name}</CardDescription>
                <div className="flex gap-2">
                  <Pencil className="cursor-pointer" />
                  <Trash className="cursor-pointer" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
