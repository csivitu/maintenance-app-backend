-- AlterTable
ALTER TABLE "CleaningJob" ADD COLUMN     "confirmedById" INTEGER,
ADD COLUMN     "issuedById" INTEGER;

-- AddForeignKey
ALTER TABLE "CleaningJob" ADD CONSTRAINT "CleaningJob_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleaningJob" ADD CONSTRAINT "CleaningJob_confirmedById_fkey" FOREIGN KEY ("confirmedById") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
