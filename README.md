# Kreate Web

This repository contains the Kreate web implementation in Gen I.

## Docker

### Build

We must prepare an `.env` before building the image.

```
# Multi Platform
docker buildx inspect teiki || docker buildx create --name teiki --node local --use
docker buildx build -t teiki/web:<tag> --platform=linux/amd64,linux/arm64 .
# Single Platform
docker buildx build -t teiki/web:latest --load .
```

### Run

`teiki-web` depends on `teiki-index` and other services.

Prepare your own `docker-compose.yml` based on https://github.com/teiki-network/teiki-index/blob/main/docker-compose.yml, with an extra service for `teiki-web`:

```yaml
web:
  image: teiki/web:latest
  build:
    context: .
    args:
      - COMMIT_SHA
  env_file:
    - .env.testnet
  environment:
    DATABASE_URL: postgres://postgres:teiki73114@postgres:5432/teiki
    IPFS_HTTP_API_ORIGIN: http://ipfs:5001
  ports:
    - "3000:3000"
  restart: on-failure
```

```sh
# Start (teiki-index and required services)
COMMIT_SHA=$(git rev-parse HEAD) docker-compose up -d --build --remove-orphans
# Check teiki-web logs
docker-compose logs -t -f web
# Stop
docker-compose down
```

## Development

### Install dependencies

```sh
npm install
```

### Start the development server

```sh
npm run dev
# or
npm run dev:turbo
```
