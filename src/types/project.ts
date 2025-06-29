type SimpleProject = {
    id: string;
    name: string;
}

type Project = {
    id: string;
    name: string;
    creationDate: Date | string;
    columns: Array<SimpleColumn>;
}

type SimpleColumn = {
    id: string;
    name: string;
    tasks: Array<SimpleTask>;
}

type SimpleTask = {
    id: string;
    title: string;
}

type Task = {
    id: string;
    title: string;
    description: string;
    deadline: Date | string;
    creationDate: Date | string;
}