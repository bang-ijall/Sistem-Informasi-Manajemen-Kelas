-- CreateTable
CREATE TABLE "public"."admin" (
    "email" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "foto" TEXT,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("email")
);
