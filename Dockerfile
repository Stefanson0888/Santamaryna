FROM node:22-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg fonts-dejavu-core \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV FFMPEG_PATH=/usr/bin/ffmpeg
ENV RENDER_FONT_PATH=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
ENV RENDER_POLL_INTERVAL_MS=2000

CMD ["npm", "run", "render:worker"]
