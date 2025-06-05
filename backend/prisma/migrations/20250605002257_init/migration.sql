-- CreateEnum
CREATE TYPE "Status" AS ENUM ('To-Do', 'In Progress', 'Done');

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "about" TEXT,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "workspace_id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("workspace_id")
);

-- CreateTable
CREATE TABLE "workspaces_lists" (
    "user_id" INTEGER NOT NULL,
    "workspace_id" INTEGER NOT NULL,

    CONSTRAINT "workspaces_lists_pkey" PRIMARY KEY ("user_id","workspace_id")
);

-- CreateTable
CREATE TABLE "classes" (
    "class_id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "meeting_link" VARCHAR(255),
    "code" VARCHAR(20) NOT NULL,
    "about" TEXT,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("class_id")
);

-- CreateTable
CREATE TABLE "classes_lists" (
    "workspace_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "classes_lists_pkey" PRIMARY KEY ("workspace_id","class_id")
);

-- CreateTable
CREATE TABLE "class_participant_lists" (
    "user_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "class_participant_lists_pkey" PRIMARY KEY ("user_id","class_id")
);

-- CreateTable
CREATE TABLE "class_editor_lists" (
    "user_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,

    CONSTRAINT "class_editor_lists_pkey" PRIMARY KEY ("user_id","class_id")
);

-- CreateTable
CREATE TABLE "lectures" (
    "lecture_id" SERIAL NOT NULL,
    "assignment" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "assignment_date" DATE,

    CONSTRAINT "lectures_pkey" PRIMARY KEY ("lecture_id")
);

-- CreateTable
CREATE TABLE "lectures_lists" (
    "class_id" INTEGER NOT NULL,
    "lecture_id" INTEGER NOT NULL,

    CONSTRAINT "lectures_lists_pkey" PRIMARY KEY ("class_id","lecture_id")
);

-- CreateTable
CREATE TABLE "user_lecture_statuses" (
    "user_id" INTEGER NOT NULL,
    "lecture_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "user_lecture_statuses_pkey" PRIMARY KEY ("user_id","lecture_id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "task_id" SERIAL NOT NULL,
    "assignment" VARCHAR(255) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "assignment_date" DATE,
    "deadline" DATE,
    "grade" DECIMAL(5,2),

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("task_id")
);

-- CreateTable
CREATE TABLE "tasks_list" (
    "class_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,

    CONSTRAINT "tasks_list_pkey" PRIMARY KEY ("class_id","task_id")
);

-- CreateTable
CREATE TABLE "user_task_statuses" (
    "user_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "user_task_statuses_pkey" PRIMARY KEY ("user_id","task_id")
);

-- CreateTable
CREATE TABLE "reports" (
    "report_id" SERIAL NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "path" TEXT,
    "upload_date" DATE,
    "grade" DECIMAL(5,2),

    CONSTRAINT "reports_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "reports_list" (
    "task_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "report_id" INTEGER NOT NULL,

    CONSTRAINT "reports_list_pkey" PRIMARY KEY ("task_id","user_id","report_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "workspaces_lists" ADD CONSTRAINT "workspaces_lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces_lists" ADD CONSTRAINT "workspaces_lists_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("workspace_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes_lists" ADD CONSTRAINT "classes_lists_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("workspace_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes_lists" ADD CONSTRAINT "classes_lists_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_participant_lists" ADD CONSTRAINT "class_participant_lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_participant_lists" ADD CONSTRAINT "class_participant_lists_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_editor_lists" ADD CONSTRAINT "class_editor_lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_editor_lists" ADD CONSTRAINT "class_editor_lists_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lectures_lists" ADD CONSTRAINT "lectures_lists_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lectures_lists" ADD CONSTRAINT "lectures_lists_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("lecture_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lecture_statuses" ADD CONSTRAINT "user_lecture_statuses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_lecture_statuses" ADD CONSTRAINT "user_lecture_statuses_lecture_id_fkey" FOREIGN KEY ("lecture_id") REFERENCES "lectures"("lecture_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks_list" ADD CONSTRAINT "tasks_list_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("class_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks_list" ADD CONSTRAINT "tasks_list_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("task_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_task_statuses" ADD CONSTRAINT "user_task_statuses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_task_statuses" ADD CONSTRAINT "user_task_statuses_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("task_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports_list" ADD CONSTRAINT "reports_list_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("task_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports_list" ADD CONSTRAINT "reports_list_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports_list" ADD CONSTRAINT "reports_list_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("report_id") ON DELETE RESTRICT ON UPDATE CASCADE;
