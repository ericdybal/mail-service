# Simple Mail Service

A simple and light web service written using NodeJS that provides email service functionality via the RESTful API. Perfect for projects that require basic email functionality accessible via the RESTful API. 

## Requirements

* Git
* NODEJS v8+
* You will need an account with MailGun and / or SendGrid (the only supported providers)


## Installation

```
git clone https://github.com/ericdybal/simple-mail-service
cd simple-mail-service

npm install
npm test 
```

## Running the service

To run the service you will need API keys for MailGun and SendGrid mail providers. Follow the links below to setup your own free accounts. 

* https://www.mailgun.com
* https://www.sendgrid.com

NOTE: Mail providers apply restrictions on the free accounts so make sure you read the documentation carefully to enable email sending. 

Once you have the API keys, go to the ./config directory and add them to the profile file (development | production). To start the service in the local environment run the following command:

```
npm run-script dev
```

## Using the service

This service supports two APIs:   

*  Sent Email

```
from - email owner
to - recipient list [comma separated list]
cc - recipient list [comma separated list]
bcc - recipient list [comma separated list]
subject - email subject
text - email content

curl -d 'from=noreply@simple-mail-service.com&to=guest@example.com&subject=Hello&text=This service is awesome !' -X POST https://hambox.com.au/simple-mail-service/mail

Returns:

header[location] - unique id of the submitted email 

```
* Get Email Status 

```
id - unique email id

curl -X GET https://hambox.com.au/simple-mail-service/mail/:id

Returns:

id - unique email id
dateCreated - date email submitted
dateSend - date email sent
status - email status [PENDING - waiting to be delivered | COMPLETED - delivered | FAILED - failed to deliver] 
errorCount - failed delivery count 
message  - message content

```

NOTE: Refer to the ./src/test/smoke.sh file for more examples.  


## Running in production

The "start" command will run the service under the PM2 process manager. See [http://pm2.keymetrics.io/](PM2) website for more information. 

```
nom run-script build
npm run-script start 
```

## TODOs

- Add more email features, e.g. security, attachments, html support, resilient email delivery mechanism, batching of emails 
- Add persistent email storage e.g. backed up by REDIS or other NSQL database. 
- Add plugin API for integration with different mail providers
- Management API
