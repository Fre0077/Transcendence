-- CreateTable
CREATE TABLE "messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_id_fkey" FOREIGN KEY ("id") REFERENCES "chats" ("chatId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "messages_id_fkey" FOREIGN KEY ("id") REFERENCES "user" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chats" (
    "chatId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    CONSTRAINT "chats_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "user" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user" (
    "userId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "linkId" INTEGER NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_members" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_members_A_fkey" FOREIGN KEY ("A") REFERENCES "chats" ("chatId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_members_B_fkey" FOREIGN KEY ("B") REFERENCES "user" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_linkId_key" ON "user"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "_members_AB_unique" ON "_members"("A", "B");

-- CreateIndex
CREATE INDEX "_members_B_index" ON "_members"("B");
