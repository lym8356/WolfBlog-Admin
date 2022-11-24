
export interface User {
    username: string;
    displayName: string;
    thumbnail?: string;
    token: string;
    bio?: string;
    roles?: string[];
}


export interface UserFormValues {
    username: string;
    password: string;
}