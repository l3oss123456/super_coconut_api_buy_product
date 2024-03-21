# Choose base image
FROM node:16-alpine

# Set working directory
# WORKDIR /usr/src/api_admin_v3
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy application code
COPY . .

# RUN npm run build
# RUN NODE_OPTIONS="--max-old-space-size=8192" npm run build


# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]