import { Client, Collection, GatewayIntentBits, Partials, Options } from 'discord.js';
import { ConfigInterface, config } from './config/config.js';
import { loadEvents, loadCommands } from './components/exports.js';
import { EventInterface, CommandInterface } from './types.js';
import logger from './logger.js';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CoffeeClient extends Client {
    public events: Collection<string, EventInterface> = new Collection();
    public commands: Collection<string, CommandInterface> = new Collection();
    public context: Collection<string, CommandInterface> = new Collection();
    public config: ConfigInterface;
    public prisma: typeof prisma;
    constructor() {
        super({
            intents: [
                GatewayIntentBits.AutoModerationConfiguration,
                GatewayIntentBits.AutoModerationExecution,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildScheduledEvents,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.GuildScheduledEvent,
                Partials.Message,
                Partials.Reaction,
                Partials.ThreadMember,
                Partials.User,
            ],
            makeCache: Options.cacheWithLimits({ GuildMessageManager: 100 }),
        });
        this.config = config;
        this.prisma = prisma;
    }

    public InitializeClient() {
        loadEvents(this)
            .then(() => {
                loadCommands(this);
            })
            .catch((e) => {
                logger.error({ message: e });
            });
        this.startClient();
    }

    public startClient() {
        this.login(this.config.client.token).catch((e) => {
            logger.error({ message: e });
        });
    }
}

new CoffeeClient().InitializeClient();
