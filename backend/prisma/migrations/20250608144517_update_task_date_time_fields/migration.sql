/*
  Warnings:

  - The `time_end` column on the `lectures` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `time_start` column on the `lectures` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `time_end` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `time_start` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "lectures" DROP COLUMN "time_end",
ADD COLUMN     "time_end" TIMESTAMP,
DROP COLUMN "time_start",
ADD COLUMN     "time_start" TIMESTAMP;

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "assignment_date" SET DATA TYPE TIMESTAMP,
ALTER COLUMN "deadline" SET DATA TYPE TIMESTAMP,
DROP COLUMN "time_end",
ADD COLUMN     "time_end" VARCHAR(8),
DROP COLUMN "time_start",
ADD COLUMN     "time_start" VARCHAR(8);
