# Minimum bot by typescript
## Development
```sh
$ yarn install
$ yarn run dev
```

and open [Bot Framework Emulator](https://github.com/microsoft/botframework-emulator).

## Deploy to Google App Engine
```sh
# edit MicrosoftAppId
$ cp .env.sample .env
$ vi .env

# deploy
$ yarn run deploy
```