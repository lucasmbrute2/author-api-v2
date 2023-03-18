-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL,
    "bio" TEXT NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pictures" (
    "id" TEXT NOT NULL,
    "html_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "alias_key" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "pictures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refreshToken" (
    "id" TEXT NOT NULL,
    "expire_in" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "refreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authors_username_key" ON "authors"("username");

-- CreateIndex
CREATE UNIQUE INDEX "pictures_alias_key_key" ON "pictures"("alias_key");

-- CreateIndex
CREATE INDEX "pictures_authorId_idx" ON "pictures"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "refreshToken_authorId_key" ON "refreshToken"("authorId");

-- CreateIndex
CREATE INDEX "refreshToken_authorId_idx" ON "refreshToken"("authorId");

-- AddForeignKey
ALTER TABLE "pictures" ADD CONSTRAINT "pictures_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refreshToken" ADD CONSTRAINT "refreshToken_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
