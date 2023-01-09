export interface Project {
    id: number;
    title: string;
    description: string;
    link: string;
    cover: string;
}

export interface ProjectFormValues {
    id?: number;
    title: string;
    description: string;
    link: string;
    cover: string;
}