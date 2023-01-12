
export interface SiteLog {
    id: number;
    description: string;
    dateAdded: Date | null;
}

export interface SiteLogFormValues {
    id?: number;
    description: string;
    dateAdded: Date | null;
}