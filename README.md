dropbox-webhook
============

Dropbox example that responds to webhook notifications to synchronize local notes written with Boostnote to Airtable

This project is looking for notes in `.cson` (CoffeeScript Object Notation) format in a Dropbox folder named `/Boostnote/notes`
      
This project uses an API token for server communication with authorization flow which prompts the user to enter an authorization code from their Dropbox account.

From the [HTTP API documentation](https://www.dropbox.com/developers/reference/oauth-guide):

> The code flow returns a code via the redirect_uri callback which should then be converted into a bearer token using the /oauth2/token call. This is the recommended flow for apps that are running on a server.

View the live app on [https://dropbox-webhook.gomix.me](https://dropbox-webhook.gomix.me).


Setting Up
----------

1. [Remix this project](https://glitch.com/edit/#!/remix/dropbox-webhook).

2. Create an app on your [Dropbox developer account](https://www.dropbox.com/developers/apps).

3. Fill in `DROPBOX_APP_KEY` and `DROPBOX_APP_SECRET` in your .env file with the app key and secret from your Dropbox app.

4. Generate a Dropbox access token and put that in your `.env` file as `DROPBOX_ACCESS_TOKEN`

5. For syncing with Airtable, enter your Airtable API key in `.env` as `AIRTABLE_API_KEY`. This is currently setup to push data to a table in Airtable called 'Raw Data', so make sure you have a table with this name.


Useful Links
------------

* [Dropbox OAuth Guide](https://www.dropbox.com/developers/reference/oauth-guide)

* [Dropbox HTTP API](https://www.dropbox.com/developers/documentation/http/documentation)

* [Dropbox JavaScript SDK](http://dropbox.github.io/dropbox-sdk-js)

* [Airtable Standard API](https://airtable.com/api)

* [Boostnote Source](https://github.com/BoostIO/Boostnote)
