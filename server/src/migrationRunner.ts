import dbMigrate from "db-migrate";

export default async (): Promise<void> => {
  const dbm = dbMigrate.getInstance(true, {
    config: `${__dirname}/../migration/database.json`,
    cwd: `${__dirname}/../migration/`,
  });
  try {
    await dbm.up();
  } catch (e) {
    console.error("error running migrations", e);
  }
  console.info("migration check completed");
};
