#! here we are building the production docker image for the application
#? to build the image we need to have docker installed in the system
#? docker build -t <ahsanzahoor/ebook-api-backend:v1> .
#? optional arguments to build the image 
#? docker build -t <ahsanzahoor/ebook-api-backend:v1> --platform linux/amd64 . 

# base image for nodejs installation in the container that is system dependency for the application
FROM node:18-alpine
# install corepack to use pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# create the working directory in the container
WORKDIR /app

# copy the package.json and package-lock.json files to the container working directory
COPY package*.json pnpm-lock.yaml ./

# Set environment variable for development
ENV NODE_ENV=development

# install dependencies
RUN pnpm install

# copy the source code to the container working directory
COPY . .

EXPOSE 3000

CMD [ "pnpm", "run", "dev" ]











#! build production image (second stage)
# FROM node:18-alpine AS production

# WORKDIR /app

# COPY package*.json ./

# # Set NODE_ENV to production so that dependencies can be installed and not devDependencies
# ENV NODE_ENV=production

# RUN npm install

# # Copy the built files from the previous stage to the current stage
# COPY --from=builder /app/dist ./dist 

# # Set the user to node so that the files are owned by the node user and not the root user of the container
# RUN chown -R node:node /app && chmod -R 755 /app

# # installing pm2 package because we need to restart the application whenever it crashes
# RUN npm install -g pm2

# # copy the pm2 config file to the container
# COPY ecosystem.config.js .

# USER node

# # expose port 
# EXPOSE 3000

# # start the application
# CMD ["pm2-runtime", "start", "ecosystem.config.js"]


