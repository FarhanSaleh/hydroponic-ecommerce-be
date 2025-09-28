import prisma from "../index.js";

const settingsData = [
  {
    key: "bank_name",
    value: "Bank Central Asia (BCA)",
    description: "Nama bank admin untuk transfer",
  },
  {
    key: "account_number",
    value: "1234567890",
    description: "Nomor rekening admin",
  },
  {
    key: "account_holder",
    value: "Admin Ecommerce",
    description: "Nama pemilik rekening admin",
  },
];

async function main() {
  console.log("Memulai seeding...");

  for (const setting of settingsData) {
    const upsertedSetting = await prisma.setting.upsert({
      where: { key: setting.key }, // Cek apakah key sudah ada
      update: { value: setting.value, description: setting.description }, // Data yang di-update jika key sudah ada
      create: setting, // Data yang di-insert jika key belum ada
    });
    console.log(`Setting '${upsertedSetting.key}' berhasil di-upsert.`);
  }

  console.log("Seeding selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
