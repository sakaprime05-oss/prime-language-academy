/**
 * Création / mise à jour des comptes administrateurs.
 *
 * Aucun mot de passe n'est stocké dans le dépôt : ils sont lus depuis
 * l'environnement, ou générés aléatoirement et affichés une seule fois.
 *
 * Usage :
 *   ADMIN_EMAIL=admin@... ADMIN_NAME="Administrateur PLA" ADMIN_PASSWORD="..." \
 *     node scripts/create-admins.mjs
 *
 * Plusieurs comptes (séparés par des virgules, dans le même ordre) :
 *   ADMIN_EMAIL="a@x.com,b@x.com" ADMIN_NAME="A,B" ADMIN_PASSWORD="pwA,pwB" \
 *     node scripts/create-admins.mjs
 */
import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const MIN_PASSWORD_LENGTH = 12;

function splitList(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function generatePassword() {
  return crypto.randomBytes(18).toString("base64url");
}

async function main() {
  const emails = splitList(process.env.ADMIN_EMAIL);
  const names = splitList(process.env.ADMIN_NAME);
  const passwords = splitList(process.env.ADMIN_PASSWORD);

  if (emails.length === 0) {
    console.error(
      "❌ ADMIN_EMAIL est requis (un email, ou plusieurs séparés par des virgules).",
    );
    process.exitCode = 1;
    return;
  }

  const generated = [];

  for (const [index, email] of emails.entries()) {
    const name = names[index] || "Administrateur PLA";
    let password = passwords[index];

    if (!password) {
      password = generatePassword();
      generated.push({ email, password });
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      console.error(
        `❌ Mot de passe trop court pour ${email} (${MIN_PASSWORD_LENGTH} caractères minimum).`,
      );
      process.exitCode = 1;
      continue;
    }

    try {
      const passwordHash = await bcrypt.hash(password, 12);

      await prisma.user.upsert({
        where: { email },
        update: { passwordHash, role: "ADMIN", status: "ACTIVE" },
        create: { email, name, passwordHash, role: "ADMIN", status: "ACTIVE" },
      });

      console.log(`✅ Compte ${email} créé/mis à jour.`);
    } catch (error) {
      console.error(`❌ Erreur pour ${email} :`, error.message);
      process.exitCode = 1;
    }
  }

  if (generated.length > 0) {
    console.log("\n--- Mots de passe générés (affichés une seule fois) ---");
    for (const item of generated) {
      console.log(`${item.email} : ${item.password}`);
    }
    console.log("Changez-les après la première connexion.\n");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
