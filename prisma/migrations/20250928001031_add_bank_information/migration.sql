-- CreateTable
CREATE TABLE "public"."BankInformation" (
    "id" SERIAL NOT NULL,
    "bank_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "BankInformation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankInformation_user_id_key" ON "public"."BankInformation"("user_id");

-- AddForeignKey
ALTER TABLE "public"."BankInformation" ADD CONSTRAINT "BankInformation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
