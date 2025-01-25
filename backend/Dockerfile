FROM node:16.14.0-alpine

# Install Python and pip
RUN apk add --no-cache python3 py3-pip

# Copy Python requirements and install
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copy package files and install dependencies
COPY package*.json .
RUN npm install

# Copy source code
COPY . .

# Expose the port (optional)
EXPOSE 3000

# Start the server
CMD ["npm", "run","dev"]