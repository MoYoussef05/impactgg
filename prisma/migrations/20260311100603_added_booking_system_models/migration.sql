-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "CoachingAvailability" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "game" TEXT,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoachingAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachingBooking" (
    "id" TEXT NOT NULL,
    "coachId" TEXT NOT NULL,
    "learnerId" TEXT NOT NULL,
    "coachingId" TEXT NOT NULL,
    "game" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "learnerNote" TEXT,
    "preferredDiscord" TEXT,
    "learnerEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoachingBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CoachingBooking_coachId_idx" ON "CoachingBooking"("coachId");

-- CreateIndex
CREATE INDEX "CoachingBooking_learnerId_idx" ON "CoachingBooking"("learnerId");

-- CreateIndex
CREATE INDEX "CoachingBooking_coachingId_idx" ON "CoachingBooking"("coachingId");

-- AddForeignKey
ALTER TABLE "CoachingAvailability" ADD CONSTRAINT "CoachingAvailability_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingBooking" ADD CONSTRAINT "CoachingBooking_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingBooking" ADD CONSTRAINT "CoachingBooking_learnerId_fkey" FOREIGN KEY ("learnerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachingBooking" ADD CONSTRAINT "CoachingBooking_coachingId_fkey" FOREIGN KEY ("coachingId") REFERENCES "Coaching"("id") ON DELETE CASCADE ON UPDATE CASCADE;
