FROM node:20-bullseye-slim
COPY . .
RUN npm install
RUN npm run build
CMD [ "node", "dist/server.js" ]