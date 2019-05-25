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

To run the service you will need API keys for the MailGun and SendGrid mail providers. Follow the links below to setup your own free accounts. 

* https://www.mailgun.com
* https://www.sendgrid.com

Add the API keys to the profile files in the  ./config/ directory. To start the service in the local environment run the following command:

```
npm run-script dev
```

## Using the service

Online documentation available from https://hambox.com.au/simple-mail-service/    


```
 Simple Mail Service
    
    @author - eric@hambox.com.au
    @feedback - https://github.com/ericdybal/simple-mail-service
  
    Usage:
      [Send Email] 
    
      POST /mail HTTP/1.1 
      Host: https://hambox.com.au/simple-mail-service
      Content-Type: application/x-www-form-urlencoded 

      Supported Parameters:
      
        * from    - email sender (mandatory)
        * to      - comma separated list of recipients (mandatory)
        * cc      - comma separated list of recipients
        * bcc     - comma separated list of recipients
        * subject - subject header
        * text    - email content, text only
          
      Response:
      
       200 - Success
        
        * header[location] - URL to check the email delivery status 
        * body    - See [Get Email Status] response      
              
       400 - Bad Request
       
        * code    - 400 
        * message - error message 
        * errors  - list of errors where each error contains the following fields:
           * location - [body | param] 
           * message  - field specific error message  
           * param    - field name 
           * value    - field value


      [Get Email Status]

      GET /mail HTTP/1.1 
      Host: https://hambox.com.au/simple-mail-service
      Content-Type: application/json 

      Supported Parameters:
      
       * id       - unique email id (mandatory)
       
       Response:
       
       200 - Success
       
       * id           - unique email id
       * dateCreated  - date email submitted for delivery
       * dateSend     - date email actually delivered
       * status       - delivery status [PENDING - waiting to be delivered | COMPLETED - delivered | FAILED - failed to deliver] 
       * errorCount   - failed delivery count (will retry upto 3 times)
       * message      - email message (see above)
       
       400 - Bad Request 
       
       * See [Send Email]
       
```

NOTE: Refer to the ./src/test/smoke.sh file for more examples.  

## Extending the service

* Implementing a custom message store. 

By default, the service uses with the in-memory message store. You can implement a custom message store by extending the following functions. 

```
(https://github.com/ericdybal/simple-mail-service/blob/master/src/repositories/messageStoreProvider.js)
(https://github.com/ericdybal/simple-mail-service/blob/master/src/repositories/inMemoryMessageStore.js)
```

## Running in production

The "start" command will start the service under the PM2 process manager. See [http://pm2.keymetrics.io/](PM2) website for more information. 

```
nom run-script build (first complile the source)
npm run-script start 
```

## TODOs

- Swagger support (https://swagger.io/)
- Add more email features, e.g. security, mime support (attachments, html), resilient email delivery mechanism, batching of emails 
- Implement persistent message store e.g. backed up by REDIS or other NSQL database. 
- Add plugin API for integration with different mail providers
- Management API
