-- CreateTable
CREATE TABLE "report_files_list" (
    "report_id" INTEGER NOT NULL,
    "file_id" INTEGER NOT NULL,

    CONSTRAINT "report_files_list_pkey" PRIMARY KEY ("report_id","file_id")
);

-- AddForeignKey
ALTER TABLE "report_files_list" ADD CONSTRAINT "report_files_list_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("report_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_files_list" ADD CONSTRAINT "report_files_list_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("file_id") ON DELETE CASCADE ON UPDATE CASCADE;
