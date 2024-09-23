# Firebase Functions for butov.dev

This directory contains the Firebase Functions for the butov.dev project.

## Environment Setup

Before running the functions, you need to set up your environment:

1. Rename the `.env.example` file to `.env`:

   ```
   cp .env.example .env
   ```

2. Open the `.env` file and set the `TELEGRAM_BOT_TOKEN` value:

   ```
   TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
   ```

   Replace `"your-telegram-bot-token"` with the actual token you received from the BotFather on Telegram.

## Important Notes

- Keep your `.env` file secure and never commit it to version control.
- The `TELEGRAM_BOT_TOKEN` is crucial for the bot's functionality. Make sure it's correctly set before deploying or testing the functions.

For more information on setting up and using Firebase Functions, refer to the [Firebase documentation](https://firebase.google.com/docs/functions).
