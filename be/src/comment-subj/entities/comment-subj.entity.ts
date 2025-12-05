import {CommentOnSubject as PrismaCommentSubj} from '@prisma/client';

export class CommentOnSubject {
    id: number;
    content: string;
    userId: number;
    subjectId: number;
    ratingExpectation: number;
    ratingDifficulty: number;
    ratingPracticality: number;
    verified: boolean;
    createdAt: Date;

    constructor(
        id: number,
        content: string,
        userId: number,
        subjectId: number,
        ratingExpectation: number,
        ratingDifficulty: number,
        ratingPracticality: number,
        verified: boolean,
        createdAt: Date
    ) {
        this.id = id;
        this.content = content;
        this.userId = userId;
        this.subjectId = subjectId;
        this.ratingExpectation = ratingExpectation;
        this.ratingDifficulty = ratingDifficulty;
        this.ratingPracticality = ratingPracticality;
        this.verified = verified;
        this.createdAt = createdAt;
    }
    static fromPrisma(prismaCommentSubj: PrismaCommentSubj): CommentOnSubject{
        return new CommentOnSubject(
            prismaCommentSubj.id,
            prismaCommentSubj.content,
            prismaCommentSubj.userId,
            prismaCommentSubj.subjectId,
            prismaCommentSubj.ratingExceptions,
            prismaCommentSubj.ratingDiffuculty,
            prismaCommentSubj.ratingPracicality,
            prismaCommentSubj.verified,
            prismaCommentSubj.createdAt
        );
    }
}
