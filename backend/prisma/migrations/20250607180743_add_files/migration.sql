/*
  Warnings:

  - You are about to drop the column `user_id` on the `classes` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `lectures` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `lectures` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `lectures` table. All the data in the column will be lost.
  - The primary key for the `reports_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `attachments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_lecture_id_fkey";

-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_user_id_fkey";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "lectures" DROP COLUMN "created_at",
DROP COLUMN "status",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "reports_list" DROP CONSTRAINT "reports_list_pkey",
ADD CONSTRAINT "reports_list_pkey" PRIMARY KEY ("task_id", "user_id", "report_id");

-- DropTable
DROP TABLE "attachments";

-- CreateTable
CREATE TABLE "files" (
    "file_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" VARCHAR(255) NOT NULL,
    "upload_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("file_id")
);

-- CreateTable
CREATE TABLE "lecture_files_list" (
    "lecture_id" INTEGER NOT NULL,
    "file_id" INTEGER NOT NULL,

    CONSTRAINT "lecture_files_list_pkey" PRIMARY KEY ("lecture_id","file_id")
);

-- CreateTable
CREATE TABLE "task_files_list" (
    "task_id" INTEGER NOT NULL,
    "file_id" INTEGER NOT NULL,

    CONSTRAINT "task_files_list_pkey" PRIMARY KEY ("task_id","file_id")
);

-- AddForeignKey
ALTER TABLE "lecture_files_list" ADD CONSTRAINT "lecture_files_list_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("lecture_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture_files_list" ADD CONSTRAINT "lecture_files_list_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("file_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_files_list" ADD CONSTRAINT "task_files_list_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("task_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_files_list" ADD CONSTRAINT "task_files_list_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("file_id") ON DELETE CASCADE ON UPDATE CASCADE;
