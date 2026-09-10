ALTER TABLE "Department" ADD COLUMN "managerId" INTEGER;

CREATE UNIQUE INDEX "Department_managerId_key"
ON "Department"("managerId");

ALTER TABLE "Department"
ADD CONSTRAINT "Department_managerId_fkey"
FOREIGN KEY ("managerId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;