# Minimum bot by typescript
## Development
```sh
$ yarn install
$ yarn run dev
```

and open [Bot Framework Emulator](https://github.com/microsoft/botframework-emulator).

## Deploy to Google App Engine
```sh
# Edit MicrosoftAppId
$ cp env.sample.yaml env.yaml
$ vi env.yaml

# Deploy
$ yarn run deploy
```

## Install bot to Microsoft Teams
```sh
$ cd teams
$ cp manifest.sample.json manifest.json

# Edit MICROSOFT_APP_ID
$ vi manifest.json

# Zip
$ zip archive.zip manifest.json 192x192.png 32x32.png

# Upload archive.zip to your Microsoft Teams
```