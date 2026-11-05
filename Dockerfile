FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY package.json ./
COPY dist/ ./dist/
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
