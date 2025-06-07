/*
  Warnings:

  - The primary key for the `reports_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `user_id` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `lectures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "lectures" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'To-Do',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "reports_list" DROP CONSTRAINT "reports_list_pkey",
ADD CONSTRAINT "reports_list_pkey" PRIMARY KEY ("user_id", "task_id", "report_id");

-- CreateTable
CREATE TABLE "attachments" (
    "attachment_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "size" INTEGER NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "url" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "lecture_id" INTEGER NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("attachment_id")
);

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("lecture_id") ON DELETE CASCADE ON UPDATE CASCADE;
