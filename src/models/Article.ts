import { Category } from "./category";
import { Tag } from "./tag";

export interface Article {
    id: string;
    title: string;
    content: string;
    category: Category;
    articleTags: Tag[];
    createdAt: Date | null;
    isDraft: boolean;
}