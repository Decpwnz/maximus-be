# Create base image
FROM node:18-alpine

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json to the /app directory in the container
COPY package.json .

# Install dependencies specified in the package.json file
RUN yarn install

# Copy all files and folders from the current directory to the /app directory in the container
COPY . .

# Create a non-root user and a group with UID/GID 1001
RUN addgroup -g 1001 -S appuser && \
    adduser -u 1001 -S appuser -G appuser

# Set user for running the application
USER appuser

# Expose port 3001
EXPOSE 3001

# Run the application
CMD ["node", "index.js"]
