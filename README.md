# Simple Mail Service

A simple and light web service written using NodeJS that provides email service functionality via the RESTful API. Perfect for projects that require basic email functionality accessible via the RESTful API. 

# Requirements

- Git
- NODEJS v8+
- You will need an account with MailGun and / or SendGrid (the only supported providers)


# Installation

git clone https://github.com/ericdybal/simple-mail-service
cd simple-mail-service

npm install
npm test 


# Running in the Local Environment

To run the service in your local environment you will need API KEYs for both MailGun and SendGrid mail providers. Follow the links below to setup your own free accounts. 

https://www.mailgun.com
https://www.sendgrid.com

NOTE: Mail providers apply restrictions on the free accounts so make sure you read the documentation carefully to enable email sending. 

Once you have the API keys, go to the ./config directory and add them to the profile file (development | production). To start the service run the following command:

npm run-script dev


# Testing the Service

To test the service, use the cURL command. Navigate to the ./src/test/smoke.sh file and modify the script with your own email addresses. The script will run through the most common usage scenarios.  

NOTE: MailGun will require additional configuration to enable email relaying when using a free account.


# Deployment

Simple-Mail-Service support PM2 process manager. The following command will start the service is cluster mode. See PM2 for more information. 

npm run-script start 


# TODOs

- Add more email features, e.g. security, attachments, html support, resilient email delivery mechanism, batching of emails 
- Add persistent email storage e.g. backed up by REDIS or other NSQL database. 
- Add plugin API for integration with different mail providers
- Management API
