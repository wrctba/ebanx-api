## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start
```

## Run tests

```bash
# unit tests
$ npm run test
```

## Expose ngrok

```bash
docker run -it --rm --net=host -e NGROK_AUTHTOKEN=<TOKEN> ngrok/ngrok:latest http host.docker.internal:3000
```
