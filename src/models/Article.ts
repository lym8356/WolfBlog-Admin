import { Category } from "./category";
import { Tag } from "./tag";

export interface Article {
    id: string;
    title: string;
    content: string;
    category: Category;
    tags: Tag[];
    craetedAt: Date | null;
    isDraft: boolean;
}