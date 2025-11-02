import {CommentOnProffessor as PrismaCommentProf} from '@prisma/client';

export class CommentOnProffessor {
    id: number;
    content: string;
    userId: number;
    professorId: number;
    createdAt: Date;
    rating: number;
    verified: boolean;

    constructor(
        id: number,
        content: string,
        userId: number,
        professorId: number,
        createdAt: Date,
        rating: number,
        verified: boolean
    ){
        this.id = id;
        this.content = content;
        this.userId = userId;
        this.professorId = professorId;
        this.createdAt = createdAt;
        this.rating = rating;
        this.verified = verified;
    }

    static fromPrisma(prismaCommentProf: PrismaCommentProf): CommentOnProffessor {
        return new CommentOnProffessor(
            prismaCommentProf.id,
            prismaCommentProf.content,
            prismaCommentProf.userId,
            prismaCommentProf.professorId,
            prismaCommentProf.createdAt,
            prismaCommentProf.rating,
            prismaCommentProf.verified
        );
    }
}
