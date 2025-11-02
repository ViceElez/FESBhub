-- AlterTable
ALTER TABLE "CommentOnProffessor" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CommentOnSubject" ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
