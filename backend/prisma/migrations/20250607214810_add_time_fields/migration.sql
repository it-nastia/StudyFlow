-- AlterTable
ALTER TABLE "lectures" ADD COLUMN     "time_end" TIME,
ADD COLUMN     "time_start" TIME;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "time_end" TIME,
ADD COLUMN     "time_start" TIME;
