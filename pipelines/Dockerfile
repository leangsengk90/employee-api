# Step 1: Use the official Node.js LTS image as the base image
FROM node:12.21-alpine AS base

# Set the working directory inside the container
WORKDIR /usr/src/app
COPY ./ ./

# Install dependencies only (with production flag)
RUN npm install

# Step 2: Create a new build stage for production (multi-stage build)
FROM node:12.21-alpine AS prod

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the necessary files for the production build from the base stage
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY ./ ./

# Expose the port your app runs on
EXPOSE 4000

# Start the application
CMD ["node", "index.js"]
