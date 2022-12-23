import { Category } from "./category";
import { Tag } from "./tag";

export interface Article {
    type: "article";
    id: string;
    title: string;
    content: string;
    category: Category;
    articleTags: Tag[];
    createdAt: Date | null;
    updatedAt: Date | null;
    isDraft: boolean;
}

export class Article implements Article {
    constructor(init?: ArticleFormValues) {
        Object.assign(this, init);
    }
}

export class ArticleFormValues {
    id?: string = undefined;
    title: string = '';
    content: string = '';
    categoryId: number | null = null;
    tagIds: number[] | null = [];
    isDraft: boolean = false;
    constructor(article?: Article) {
        if (article) {
            this.id = article.id;
            this.title = article.title;
            this.content = article.content;
            this.categoryId = article.category.id;
            article.articleTags.forEach(tag => this.tagIds?.push(tag.id));
            this.isDraft = article.isDraft;
        }
    }
}