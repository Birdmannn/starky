# Starky README

Welcome to Starky!

Starky is a Discord bot that lets you token-gate roles and channels with Starknet assets.

You can use Starky for free to token-gate roles and channels for your community.

Note: to use the hosted version of Starky right now, just go to [https://starky.wtf/](https://starky.wtf/) and follow instructions!

Don’t hesitate to join our Telegram group to ask any questions related to Starky! [https://t.me/+Mi34Im1Uafc1Y2Q8](https://t.me/+Mi34Im1Uafc1Y2Q8)

# How Starky works

Starky is a Discord bot. To use Starky, a Discord server admin can install the Starky application. This application takes the form of a bot that lives inside your Discord server, and implements a few [application commands](https://discord.com/developers/docs/interactions/application-commands).

The first application command is `/starky-configure` and can be used only by the admin. With this command, the admin can configure Starky, namely:

- the Starknet network to use Starky on (Goerli or Mainnet)
- the Discord role to assign to the discord users who match the criteria
- the Starky module to use (ERC-721 for instance)
- some module specific settings (for ERC-721, the address of the contract to use for token gating)

Then, discord users can use the `/starky-connect` command to link their Starknet identity to the Discord server. When they use this command, they receive a custom link that drives them to a web interface where they can link their Starknet wallet to this Discord server by signing a message. This message is verified by the backend by calling the `is_valid_signature` method of the user’s account contract.

Once a user’s Starknet identity has been linked to the discord server, the Starky backend checks, on a regular basis, if the user’s Starknet wallet matches the Starky module’s specific conditions. For the ERC-721 Starky module, for instance, Starky checks if the user owns at least 1 NFT from the collection.

If the user matches the conditions, Starky gives the configured role to the user. If not, it removes the role from the user.

# Starky technical components

Starky has a few components:

- a [Discord application](https://discord.com/developers/applications) that provides an application ID and a bot token to interact with the Discord API
- a [Next.js application](https://nextjs.org/) to provide a dynamic frontend to connect a Starknet wallet and sign a message
- a Postgres database to save information about the configured Discord servers and Discord users
- a cron that checks, on a regular basis, if the configured Discord users match the criteria of the configured Starky module for a given server

# Hosted version

We provide a hosted version of Starky for everyone to use. Just go to [https://starky.wtf/](https://starky.wtf/) and follow instructions to get up and running quickly!

# Self-host Starky

We developed Starky as open-source under the MIT license. While we host a version for everyone to use on [https://starky.wtf/](https://starky.wtf/), we know that some people prefer hosting it themselves for security reasons.

Here, we detail how to do just that.

## Step 1: host a Postgres DB

Starky needs a Postgres database to save information, so make sure to have the credentials for your database ready!

## Step 2: create a Discord application

To function, Starky needs a Discord client ID and a Discord bot token. Go to [https://discord.com/developers/applications](https://discord.com/developers/applications) and create a new application. You can give it a name, logo and description, but they don’t really matter, as if you host Starky yourself, it’s probably just to use it on your Discord server and only you will install this Discord app.

In “General information”, copy your APPLICATION ID.

Next, go to “Bot” and click “Add Bot”. This will create a bot for your Discord application, giving your application life in your Discord server. Here, you can choose a name for the Discord bot (this is the name the Starky Discord bot will have in your Discord server).

If you want to install this bot yourself on your own server, you can uncheck the “Public bot” setting.

Copy your bot TOKEN: if it doesn’t show, just click “Reset Token” and copy the newly generated token.

## Step 3: host Starky

Starky is a Next.js application with a custom server. Indeed it’s more than just a Next.js application, it also launches the Discord bot (i.e. ability to react to Application Commands) and a cron (a regular check to assign / unassign roles in Discord).

Note: Starky unfortunately cannot be hosted on Vercel (a usually obvious Next.js choice!) as it needs to stay up and running so the bot is always active, and Vercel Next.js hosting are run on each request but don’t stay up.

We provide a docker version of Starky here: [https://hub.docker.com/r/noemalzieu/starky](https://hub.docker.com/r/noemalzieu/starky)

Just run the `noemalzieu/starky:latest` docker container, providing the following environment variables:

- `NEXT_PUBLIC_DISCORD_CLIENT_ID` : the Discord application ID from step 2
- `DISCORD_BOT_TOKEN` : the Discord bot token from step 2
- `UPDATE_STATUS_EVERY_SECONDS` (optional) : the cron interval in seconds

## Step 4: install your Discord application on your server

Just open the following URL in your browser:

[`https://discord.com/api/oauth2/authorize?client_id=DISCORD_CLIENT_ID&permissions=268435456&scope=applications.commands bot`](https://discord.com/api/oauth2/authorize?client_id=DISCORD_CLIENT_ID&permissions=268435456&scope=applications.commands%20bot)

replacing DISCORD_CLIENT_ID with your Discord application ID from step 2.

`permissions=268435456` corresponds to the “Manage Roles” permission that your bot needs to have to be able to assign / remove roles from users

## Step 5: configure Starky on your Discord server

Just enter `/starky-configure` and follow instructions!

# Developing your own Starky module

Starky works in a modular way. It’s fairly easy to add a new Starky module, giving new token gating features to your Discord server!

To create a new Starky module, just create a new file in the `starkyModules` folder, and import it in `starkyModules/index.ts` ! Your file must export:

- `name` : the name of your Starky module
- `fields` : a list of module-specific settings that the Discord bot will ask while configuring
- `shouldHaveRole` : the method that will be called, for each configured Discord user on your server, to check if the user should have the token-gated role. This is where the magic happens! Do your module specific checks and return a boolean stating if the user should have the role. This method gets the user’s Starknet wallet address as a parameter as well as the module specific settings (i.e. the answers given to the `fields` during the module configuration)

Don’t hesitate to join our Telegram group to ask any questions related to Starky! [https://t.me/+Mi34Im1Uafc1Y2Q8](https://t.me/+Mi34Im1Uafc1Y2Q8)