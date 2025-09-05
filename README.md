# Discord Role Migrator

A minimal Node.js script (discord.js v14) that migrates members from one role to another: it adds a **new** role to all members who currently have an **old** role, then removes the old role.

**Developer Portal:** https://discord.com/developers/applications

**Credit:** Configuration walkthrough inspired by this tutorial (05:30–13:10): https://www.youtube.com/watch?v=YD_N6Ffoojw

## Configuration

This script uses a bot and the official Discord API.

1. Bot setup  
   - In the Discord Developer Portal → **Bot** tab, enable **Server Members Intent**.  
   - Invite the bot to your server with at least **Manage Roles** (Administrator is OK).  
   - In Server Settings → Roles, move the bot’s highest role **above** both the old and new roles.  
   - Ensure the target roles are **not managed** (managed roles can’t be edited).

2. Dependencies  
   - Node.js 18+  
   - Install packages:
     ```bash
     npm i discord.js dotenv
     ```
   - Ensure your `package.json` contains:
     ```json
     { "type": "module" }
     ```

3. Environment  
   Create a `.env` file in the project root:

   ```env
   DISCORD_TOKEN=your_bot_token_here
   GUILD_ID=123456789012345678
   OLD_ROLE_ID=111111111111111111
   NEW_ROLE_ID=222222222222222222

   # Optional
   DRY_RUN=true
   PAUSE_MS=750
   ```

   - `DISCORD_TOKEN`: Your bot token from the Developer Portal.  
   - `GUILD_ID`: The ID of your Discord server (guild).  
   - `OLD_ROLE_ID`: The ID of the role you want to migrate members **from**.  
   - `NEW_ROLE_ID`: The ID of the role you want to migrate members **to**.  
   - `DRY_RUN`: If `true`, the script will only log counts and will not change roles.  
   - `PAUSE_MS`: Extra delay between processing members (helps with rate limits).

## How to Run

1. Dry run (recommended). This logs how many members would be changed without applying updates:
   ```bash
   node migrate-roles.js
   ```

   With `DRY_RUN=true` in `.env`, no roles are modified.

2. Live run. Set `DRY_RUN=false` (or remove it) in `.env`, then:
   ```bash
   node migrate-roles.js
   ```

3. Reversing a migration. Swap `OLD_ROLE_ID` and `NEW_ROLE_ID` in `.env` and run again.

## Troubleshooting

- **Used disallowed intents**  
  Enable **Server Members Intent** for the correct application in the Developer Portal.

- **50013 (Missing Permissions)**  
  Fix role hierarchy (bot above target roles and above members’ highest roles). Ensure roles are not managed and the server owner is not targeted.

