/*
  Warnings:

  - Added the required column `upvotes` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Project_slug_key";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "upvotes" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "image" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Upvote" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
