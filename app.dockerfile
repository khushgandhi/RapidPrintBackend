FROM node:10.16.0



# Set working directory
WORKDIR /var/www

# Copy package-lock.json and package.json
COPY package-lock.json package.json /var/www/

# Install dependencies
RUN apt-get update && apt-get install -y \
    zip \
    git \
    curl \
    supervisor

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*
  
#Install dependencies
RUN npm install 

#start application
EXPOSE 8080

CMD ["npm","start"]