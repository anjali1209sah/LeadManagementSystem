#### Healthcare Lead Management System
# About 
    A Lead Management System for ayurvedic fertility clinics to track and manage patient inquiries and consultations. The system includes automated status updates based on lead activity and inactivity.

### Technical Stack 
# Language : NodeJs , JavaScript 
# Database : PostGress
# Deployment : Docker

### MAJOR TASK 

# Task 1: Implement authentication with Google Auth and error handling.
# Task 2: Setup API Gateway, Lead Management Service (CRUD operations), and PostgreSQL with Prisma.
# Task 3: Implement status management and automated daily updates using AWS EventBridge.
# Task 4: Automate status updates, implement failure recovery, and test end-to-end.
# Task 5: Create dashboards, analytics, and refine performance optimizations.

### COMMANDS 
## RUN CODE

	npm install -i
	npm run start

## RUN DOCKER 

# To start docker 
    docker-compose up -d
# Check Docker Running
    docker ps
# Test PostGres Connection
    npx prisma db pull
# Get Logs
    docker logs postgres_db

## GENERATE PRISMA CLIENT

	npx prisma generate

### Google Auth Login

http://localhost:3000/

1. Create a Google project in the Google Console for google auth credietails such as GOOGLE_CLIENT_ID , GOOGLE_CLIENT_SECRET and also enable the OAuth2 API.
2. Install Passport.js, configure the passport-google-oauth20 strategy, set up routes for login/logout, manage sessions with JWT token and add callback url in google console to handle login callbacks.

### Lead Management System

## CRUD Operation 

1. Create 

curl --location 'http://localhost:3000/api/v1/lead' \
--header 'Content-Type: application/json' \
--data-raw '{"name":"Anjali Kumari" , "email" : "anjaliKumari123@gmail.com" , "phone" :"123456789"}'

2. Get 

curl --location 'http://localhost:3000/api/v1/lead/1' \
--header 'Content-Type: application/json'

3. Update

curl --location --request PUT 'http://localhost:3000/api/v1/lead/1' \
--header 'Content-Type: application/json' \
--data '{"name":"Anjali Kumari" , "phone" :"123456789"}'

4. Delete

curl --location 'http://localhost:3000/api/v1/lead/1' \
--header 'Content-Type: application/json'


### Resources 

# Google Developer Console: [https://console.cloud.google.com/](https://console.cloud.google.com/)
# Passport.js Documentation: [http://www.passportjs.org/](http://www.passportjs.org/)



