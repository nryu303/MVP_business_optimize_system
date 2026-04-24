import pkg from "../packages/db/generated/prisma/index.js";
const { PrismaClient } = pkg;
const p = new PrismaClient();
console.log("list:", typeof p.list);
console.log("messageTemplate:", typeof p.messageTemplate);
console.log("senderTemplate:", typeof p.senderTemplate);
console.log("blacklistEntry:", typeof p.blacklistEntry);
console.log("setting:", typeof p.setting);
await p.$disconnect();
