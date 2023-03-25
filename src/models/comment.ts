export interface Comment {
    id: string;
    content: string;
    createdAt: Date | null;
    commenterUsername: string;
    commenterEmail: string;
    parentCommentId: string;
    replyToArticleId: string;
    type: string;
}