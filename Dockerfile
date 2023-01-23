FROM node
WORKDIR /zadanie2
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
RUN npm uninstall bcrypt
RUN npm install bcrypt
CMD ["npm","start"]