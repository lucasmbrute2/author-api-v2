-- AlterTable
ALTER TABLE "authors" ALTER COLUMN "deleted_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pictures" ALTER COLUMN "deleted_at" DROP NOT NULL;
