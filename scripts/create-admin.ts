/**
 * Creates or resets the admin account.
 *
 *   npm run create-admin -- --email you@example.com --name "Angela Rotvik"
 *
 * The password is read from the ADMIN_PASSWORD environment variable, or
 * prompted for interactively, so it never appears in source code or shell history.
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set (add it to .env.local)");

  const email = (arg("email") ?? process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const name = arg("name") ?? process.env.ADMIN_NAME ?? "Administrator";
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Provide a valid --email");

  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    const rl = createInterface({ input: stdin, output: stdout });
    password = await rl.question("Admin password (min 12 chars, letters and numbers): ");
    rl.close();
  }
  if (!password || password.length < 12 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new Error("Password must be at least 12 characters and include letters and numbers");
  }

  await mongoose.connect(uri);
  const passwordHash = await bcrypt.hash(password, 12);
  const col = mongoose.connection.collection("adminusers");
  const existing = await col.findOne({ email });
  const now = new Date();
  await col.updateOne(
    { email },
    {
      $set: { email, name, passwordHash, failedLogins: 0, lockUntil: null, updatedAt: now },
      $inc: { sessionVersion: 1 },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );
  await col.createIndex({ email: 1 }, { unique: true });
  console.log(existing ? `Updated admin ${email}` : `Created admin ${email}`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err instanceof Error ? err.message : err);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
