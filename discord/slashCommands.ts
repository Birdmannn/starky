import { SlashCommandBuilder, Routes } from "discord.js";

import { REST } from "@discordjs/rest";
import config from "../config";

export const registerSlashCommands = async () => {
  const restDiscordClient = new REST({ version: "10" }).setToken(
    config.DISCORD_BOT_TOKEN
  );

  const slashCommands = [
    new SlashCommandBuilder()
      .setName("starky-connect")
      .setDescription("Connect your Starknet wallet to this Discord server"),
    new SlashCommandBuilder()
      .setName("starky-disconnect")
      .setDescription(
        "Disconnect your Starknet wallet from this Discord server"
      ),
    new SlashCommandBuilder()
      .setName("starky-config")
      .setDescription("Configure starky on this server"),
  ].map((command) => command.toJSON());
  console.log("> Registering Discord slash commands...");
  await restDiscordClient.put(
    Routes.applicationCommands(config.DISCORD_CLIENT_ID),
    {
      body: slashCommands,
    }
  );
  console.log("> Registered Discord slash commands!");
};
