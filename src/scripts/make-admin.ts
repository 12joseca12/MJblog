import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
    const mod = await import("../lib/firebaseAdmin");
    const { adminAuth } = mod;

    const uid = "6fqHSN4WsvMr221BjoqpPmx9pK73";
    await adminAuth.setCustomUserClaims(uid, { admin: true });
    console.log("Admin asignado a:", uid);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
