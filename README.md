# Simple Mail Service

A simple and lightweight web service written using NodeJS that provides email functionality accessible via the RESTful API.

## Features
* **Simple API**: A minimalistic API composed of only two endpoints (POST email | GET email delivery status).
* **Backup Email Providers**: Support for multiple email providers (PRIMARY|BACKUP).
* **Integration with Popular Email Providers**: Out of the box support for **MailGun** and **SendGrid** email providers.  
* **Resilient Email Delivery**: Emails are cached on the server for a period of time and a number of attempts is made to redeliver the emails.
* **Extension Mechanism**: A simple extension mechanism to integrate with custom email providers. 
* **Simple Configuration**:JSON based configuration.  

## Requirements

* Git
* NODEJS v8+
* You will need an account with MailGun and / or SendGrid (the only supported providers)


## Installation

```
git clone https://github.com/ericdybal/simple-mail-service
cd simple-mail-service

npm install 
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


      [Get Email Delivery Status]

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

* **Custom email provider**

The following shows how to implement a custom email provider. 

```
let providerConfig

export const init = config => providerConfig = config

export const sendEmail = async (message) => {
  return axios({
    method: 'post',
    url: `https://api.mailgun.net/v3/sandbox3900691a3a094d2c861f477ec5acd14f.mailgun.org/messages`,
    auth: {
      username: 'api',
      password: providerConfig.apiKey,
    },
    params: {
      from: message.from,
      to: message.to.join(','),
      cc: message.cc ? message.cc.join(',') : undefined,
      bcc: message.bcc ? message.bcc.join(',') : undefined,
      subject: message.subject,
      text: message.text
    },
  })
}
```

* **Custom email store** 

By default, the service ships with the in-memory email store. You can implement a custom email store by implementing the following methods and registerinfg the  store with the email store provider factory. Refer to **emailStoreProvider.js** for more information. 

```
export const push = async (item) => {
  return Promise.reject(new Error('Not implemented!'))
}

export const findByStatus = async (status) => {
  return Promise.reject(new Error('Not implemented!'))
}

export const findById = async (id) => {
  return Promise.reject(new Error('Not implemented!'))
}

export const updateById = async (updated) => {
  return Promise.reject(new Error('Not implemented!'))
}

export const clearAll = async (status) => {
  return Promise.reject(new Error('Not implemented!'))
}

export const count = async () => {
  return Promise.reject(new Error('Not implemented!'))
}
```


## Running in production

Running the service in production is done via the PM2 process manager. See [http://pm2.keymetrics.io/](PM2) website for more information. 

```
npm run-script start 
```

**NOTE**: Currently the production deployment is limited to single PM2 node due to the in-memory email store. 

## TODOs

- Swagger support (https://swagger.io/)
- Add more email features, e.g. security, mime support (attachments, html), batching of emails 
- Implement persistent message store e.g. backed up by REDIS or other NSQL database
- Management API
