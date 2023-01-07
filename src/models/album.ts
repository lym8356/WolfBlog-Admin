import { Image } from "./image";

export interface Album {
    id: number;
    title: string;
    description: string;
    path: string;
    cover: string;
    albumPhotos: Image[];
}

export interface AlbumFormValues {
    id?: number;
    title: string;
    description: string;
}