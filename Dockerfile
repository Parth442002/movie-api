FROM node:18.16.0-alpine as base

WORKDIR /app

COPY package*.json ./


#Install Typescript
RUN npm install -g typescript
# Install dependencies
RUN npm install


#Copy the rest of the files
COPY . .

#Build the application
RUN npm run build

# Expose the port on which your app runs
EXPOSE 3000

#Run The Application
CMD ["npm", "run", "start"]