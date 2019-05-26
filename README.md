# Simple Mail Service

A simple and lightweight web service written using NodeJS that provides email functionality accessible via the RESTful API.


## Features
* **Simple API**: A minimalistic API composed of only two endpoints (POST email | GET email delivery status).
* **Backup Email Provider**: Automatic failover to the BACKUP email provider.
* **MailGun and SendGrid Integration**: Out of the box support for the popular **MailGun** and **SendGrid** email providers.  
* **Resilient Email Delivery**: Undelivered emails are cached on the server while a number of attempts is made to redeliver the emails.
* **Extension API**: Extension API to integrate with other email providers. 
* **Simple Configuration**: Essy to use and understand JSON based configuration.  


## Use Cases

* **Development and Testing**: Great for development and testing teams that work with the email intensive applications or mailing campaings. This service can be configured to short-circuit all outgoing emails to ensure that they don't reach their intended recipients during the development or testing phase of the project.  
* **Internal Email Gateway**: The service can be used behind the coorporate firewall as a simple outgoing email gateway. 


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

## Configuration Options

By default the service requires API keys for the MailGun and SendGrid email providers. Follow the links below to setup your own free accounts. 

* https://www.mailgun.com
* https://www.sendgrid.com


### Supported configuration options:

```
const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['development', 'test', 'production'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
  },
  email: {
    retainPeriod: {
      doc: 'Retention period of FAILED and COMPLETED emails.',
      format: 'duration',
      default: '1 day',
    },
    deliveryRetryCount: {
      doc: 'The number of attempts to deliver a FAILED email.',
      format: 'int',
      default: 3,
    },
    deliveryRetryPeriod: {
      doc: 'The elapsed time after an attempt will be made to deliver a FAILED email.',
      format: 'duration',
      default: '15 mins',
    },
  },
  emailStore: {
    type: {
      doc: 'The email store type.',
      format: ['in-memory', 'persistent'],
      default: 'in-memory',
    },
    size: {
      doc: 'The number of queued emails.',
      format: 'int',
      default: 10000,
    }
  },
  emailProvider: [{
    type: {
      doc: 'mailProvider type',
      format: ['primary', 'backup'],
      default: 'primary'
    },
    name: {
      doc: 'mailProvider name',
      format: String,
      default: ''
    },
    apiKey: {
      doc: 'Api Key',
      format: String,
      default: ''
    },
  }],
})
```

## Running the service

To start the service in the local environment run the following command:

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

### Custom email provider

The following example shows how to implement a custom email provider. To register a custom email provider with the service, refer to **emailProvider.js**. 

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

### Custom email store 

By default, the service ships with the in-memory email store. You can implement a custom email store by implementing the following interface and registering the implementation with the store provider factory. Refer to **emailStoreProvider.js**. 

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

* Swagger support (https://swagger.io/)
* Add more email features, e.g. security, mime support (attachments, html), batching of emails 
* Implement persistent message store e.g. backed up by REDIS or other NSQL database
* Docker integration 
* Management API
