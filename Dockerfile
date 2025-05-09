FROM node:18-slim

# Instalar dependencias del sistema incluyendo libgbm1
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgbm1 \        
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \   
    libnspr4 \
    libnss3 \
    libpangocairo-1.0-0 \  
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \     
    libxrandr2 \
    libdrm2 \
    libxshmfence1 \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY index.js ./

RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]