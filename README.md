# Kreate Web

This repository contains the Kreate web implementation in Gen I.

## Docker

### Build

We must prepare an `.env` before building the image.

```
# Multi Platform
docker buildx inspect kreate || docker buildx create --name kreate --node local --use
docker buildx build -t kreate/web:<tag> --platform=linux/amd64,linux/arm64 .
# Single Platform
docker buildx build -t kreate/web:latest --load .
```

### Run

`kreate-web` depends on `kreate-index` and other services.

Prepare your own `docker-compose.yml` based on https://github.com/kreate-community/kreate-index/blob/main/docker-compose.yml, with an extra service for `kreate-web`:

```yaml
web:
  image: kreate/web:latest
  build:
    context: .
    args:
      - COMMIT_SHA
  env_file:
    - .env.testnet
  environment:
    DATABASE_URL: postgres://postgres:teiki73114@postgres:5432/kreate
    IPFS_HTTP_API_ORIGIN: http://ipfs:5001
  ports:
    - "3000:3000"
  restart: on-failure
```

```sh
# Start (kreate-index and required services)
COMMIT_SHA=$(git rev-parse HEAD) docker-compose up -d --build --remove-orphans
# Check kreate-web logs
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
