FROM node:6
RUN apt-get update && apt-get install -y libasound2-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . ./
CMD ["npm", "start"]
ENV MY_PORT 3000
EXPOSE $MY_PORT