import mongoose from "mongoose";
const uri = process.env.MONGODB_URI;
const email = process.env.ADMIN_EMAIL?.toLowerCase();
if (!uri || !email) { console.error("Set MONGODB_URI and ADMIN_EMAIL first."); process.exit(1); }
await mongoose.connect(uri);
const result = await mongoose.connection.collection("users").updateOne({ email }, { $set: { role: "admin" } });
if (!result.matchedCount) { console.error(`No account found for ${email}. Register that user first.`); process.exitCode = 1; }
else console.log(`Promoted ${email} to admin.`);
await mongoose.disconnect();
