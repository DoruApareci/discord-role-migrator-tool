import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';

const {
  DISCORD_TOKEN,
  GUILD_ID,
  OLD_ROLE_ID,
  NEW_ROLE_ID,
  DRY_RUN = 'false',
  PAUSE_MS = '750',
} = process.env;

if (!DISCORD_TOKEN || !GUILD_ID || !OLD_ROLE_ID || !NEW_ROLE_ID) {
  console.error('Missing required env vars: DISCORD_TOKEN, GUILD_ID, OLD_ROLE_ID, NEW_ROLE_ID');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    await guild.members.fetch(); // requires Server Members Intent enabled in portal

    const oldRole = await guild.roles.fetch(OLD_ROLE_ID);
    const newRole = await guild.roles.fetch(NEW_ROLE_ID);
    if (!oldRole || !newRole) throw new Error('Old/New role not found (check IDs and role hierarchy)');

    const targets = guild.members.cache.filter((m) => m.roles.cache.has(OLD_ROLE_ID));
    console.log(`Members with old role: ${targets.size}`);

    const dry = DRY_RUN.toLowerCase() === 'true';
    const pause = Number.parseInt(PAUSE_MS, 10) || 0;

    let added = 0, skipped = 0, failed = 0;

    for (const m of targets.values()) {
      try {
        if (m.user.bot) { skipped++; continue; }
        if (m.roles.cache.has(NEW_ROLE_ID)) { skipped++; continue; }

        if (!dry) {
          await m.roles.add(NEW_ROLE_ID, 'Role migration');
          await sleep(400);
          await m.roles.remove(OLD_ROLE_ID, 'Role migration');
        }
        added++;
      } catch (err) {
        failed++;
        console.error(`Failed for ${m.user.tag} (${m.id}):`, err?.code ?? err?.message ?? err);
      }
      if (pause) await sleep(pause);
    }

    console.log(`Done. Added: ${added}, skipped: ${skipped}, failed: ${failed}, dryRun=${dry}`);
  } catch (e) {
    console.error('Fatal:', e);
  } finally {
    await client.destroy();
    process.exit(0);
  }
});

client.login(DISCORD_TOKEN);
