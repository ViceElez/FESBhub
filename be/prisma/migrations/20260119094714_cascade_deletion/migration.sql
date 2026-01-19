-- DropForeignKey
ALTER TABLE "CommentOnProffessor" DROP CONSTRAINT "CommentOnProffessor_professorId_fkey";

-- DropForeignKey
ALTER TABLE "CommentOnProffessor" DROP CONSTRAINT "CommentOnProffessor_userId_fkey";

-- DropForeignKey
ALTER TABLE "CommentOnSubject" DROP CONSTRAINT "CommentOnSubject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "CommentOnSubject" DROP CONSTRAINT "CommentOnSubject_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropForeignKey
ALTER TABLE "PostImage" DROP CONSTRAINT "PostImage_postId_fkey";

-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "professorImageUrl" TEXT;

-- AddForeignKey
ALTER TABLE "CommentOnProffessor" ADD CONSTRAINT "CommentOnProffessor_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOnProffessor" ADD CONSTRAINT "CommentOnProffessor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOnSubject" ADD CONSTRAINT "CommentOnSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentOnSubject" ADD CONSTRAINT "CommentOnSubject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostImage" ADD CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
