FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npm run prisma:generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Run migrations and start app
CMD ["sh", "-c", "npm run prisma:migrate:prod && npm run start:prod"]
