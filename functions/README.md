# Firebase Functions Deployment Setup for Telegram Bot

This README provides instructions on how to set up the Telegram bot token in Firebase config before deploying your Firebase Functions project.

## Setting the Telegram Bot Token

Before deploying your Firebase Functions, you need to set the Telegram bot token in your Firebase config. Follow these steps:

1. Open your terminal or command prompt.

2. Use the Firebase CLI to set the Telegram bot token as an environment variable:

   ```
   firebase functions:config:set telegram.bot_token="YOUR_BOT_TOKEN_HERE"
   ```

   Replace "YOUR_BOT_TOKEN_HERE" with your actual Telegram bot token.

3. Verify that the token has been set correctly:

   ```
   firebase functions:config:get
   ```

   This should display your current configuration, including the telegram.bot_token.

## Accessing the Bot Token in Your Code

Once you've set the bot token in your Firebase config, you can access it in your code like this:
