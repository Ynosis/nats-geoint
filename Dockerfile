# Build
FROM docker.io/golang:1.20.1-alpine3.17 as builder
WORKDIR /build

COPY . .

RUN go mod download

RUN go build -o /bin/app cmd/microlith/main.go

CMD ["/bin/app"]

# Deployment
FROM docker.io/alpine:3.17.2

RUN apk add --no-cache ffmpeg

WORKDIR /server
COPY --from=builder /bin/app app
COPY --from=builder /build/assets assets

CMD ["/server/app"]
