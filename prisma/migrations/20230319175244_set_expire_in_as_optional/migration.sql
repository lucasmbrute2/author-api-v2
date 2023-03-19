-- AlterTable
ALTER TABLE "authors" ALTER COLUMN "bio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "refreshToken" ALTER COLUMN "expire_in" DROP NOT NULL;
