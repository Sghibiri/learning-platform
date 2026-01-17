-- AlterTable
ALTER TABLE "AccessCode" ADD COLUMN     "baserowApiToken" TEXT,
ADD COLUMN     "baserowFlashcardsTableId" TEXT,
ADD COLUMN     "baserowLessonsTableId" TEXT,
ADD COLUMN     "baserowQuestionsTableId" TEXT,
ADD COLUMN     "baserowTestsTableId" TEXT;
