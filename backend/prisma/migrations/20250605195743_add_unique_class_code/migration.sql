/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `classes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "classes_code_key" ON "classes"("code");
