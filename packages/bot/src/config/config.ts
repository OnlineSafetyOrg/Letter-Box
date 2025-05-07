import { ObjectNameIDArray } from '../types';

import process from 'node:process';
import dotenv from 'dotenv';
dotenv.config();

export type webhookArray = Array<{ name: string; id: string; token: string }>;

export interface ConfigInterface {
    client: {
        token: string;
        id: string;
        secret: string;
    };
    anonLetter: {
        total_letters_channel_id: string;
        today_letters_channel_id: string;
        replied_letters_channel_id: string;
        pending_letters_channel_id: string;
        flagged_letters_channel_id: string;
        letter_guild_id: string;
        letter_channel_id: string;
    };
    guilds: ObjectNameIDArray;
    webhooks: webhookArray;
}

export const config: ConfigInterface = {
    client: {
        token: process.env.CLIENT_TOKEN as string,
        id: process.env.CLIENT_ID as string,
        secret: process.env.CLIENT_SECRET as string,
    },
    anonLetter: {
        total_letters_channel_id: process.env.TOTAL_LETTERS_CHANNEL_ID as string,
        today_letters_channel_id: process.env.TODAY_LETTERS_CHANNEL_ID as string,
        replied_letters_channel_id: process.env.REPLIED_LETTERS_CHANNEL_ID as string,
        pending_letters_channel_id: process.env.PENDING_LETTERS_CHANNEL_ID as string,
        flagged_letters_channel_id: process.env.FLAGGED_LETTERS_CHANNEL_ID as string,
        letter_guild_id: process.env.LETTER_GUILD_ID as string,
        letter_channel_id: process.env.LETTER_CHANNEL_ID as string,
    },
    guilds: [
        {
            name: 'Online Safety',
            id: '1360001636424093928',
        },
    ],
    webhooks: [],
};
