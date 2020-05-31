# Send proactive message to your Microsoft Teams
## Development
```sh
$ yarn install
$ yarn run dev
```

and open [Bot Framework Emulator](https://github.com/microsoft/botframework-emulator).

**Send proactive message**

```sh
$ curl http://localhost:3978/api/notify
```


## Deploy to Google App Engine
```sh
# Edit MicrosoftAppId
$ cp env.sample.yaml env.yaml
$ vi env.yaml

# Deploy
$ yarn run deploy
```
