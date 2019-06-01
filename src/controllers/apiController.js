import status from 'http-status';
import uuid from 'uuid';
import getEmailStore from '../repositories/emailStoreProvider';
import config from '../config/config';


export const sendEmail = async (req, res, next) => {

  try {
    const queueSize = config.get('emailStore.size');
    const emailCount = await getEmailStore().count();

    if (emailCount >= queueSize) {
      res.sendStatus(status.SERVICE_UNAVAILABLE);
      res.end();

    } else {
      const emailEntry = {
        id: uuid(),
        dateCreated: new Date(),
        dateSent: null,
        status: 'PENDING',
        errorCount: 0,
        message: {
          from: req.body.from,
          to: req.body.to,
          cc: req.body.cc,
          bcc: req.body.bcc,
          subject: req.body.subject,
          text: req.body.text,
        },
      };

      const result = await getEmailStore().push(emailEntry);

      res.status(status.CREATED);
      res.setHeader('Location', '/api/mail/' + result.id);
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
};

export const getEmail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await getEmailStore().findById(id);

    res.status(result ? status.OK : status.NOT_FOUND);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const help = (req, res) => {
  res.status(status.OK);
  res.setHeader('Content-Type', 'text/plain');
  res.send(`
  
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
       
    `);
};


