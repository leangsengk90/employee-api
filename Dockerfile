FROM node:12.21.0
WORKDIR "/app/"
ADD package.json /app/
RUN npm install
COPY . "/app/"
CMD ["node", "index.js"]
