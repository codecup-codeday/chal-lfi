# CodeCup Challenge LFI
[![Build](https://github.com/codecup-codeday/chal-lfi/actions/workflows/docker-image.yml/badge.svg)](https://github.com/codecup-codeday/chal-lfi/actions/workflows/docker-image.yml)
## A simple Node server vulnerable to LFI

This is a CTF challenge that requires the user to exploit LFI to find the flag. Note that this particular app is Linux specific, and the flag must be specified through an environment variable.

### Build Docker Container

```shell
docker build -t codecup-codeday/chal-lfi:latest .
```

### Environment Variables

`FLAG` - Required, the flag the user will find.
`PORT` - Not Required, the port the app runs on - defaults to `8080`.
`SEED` - Not Required, the seed the website will be generated on  - defaults to the FLAG env.

### Example

```shell
# Set Environment Variable(s)
export PORT=8080
export SEED=test
export FLAG=test
# Bare Metal
pnpm install --prod
node src/server.js
# Docker Container
docker run -e PORT -e SEED -e FLAG -p $PORT:$PORT codecup-codeday/chal-lfi:latest
# Docker Container w/ Init
docker run -it --init -e PORT -e SEED -e FLAG -p $PORT:$PORT codecup-codeday/chal-lfi:latest
```
