Hi here we have a site that works on login and registration and we have to create a user in order to use
it without a user we have no access to what it can offer. He gives us a service of working with artificial
intelligence in text, a service of shortening links, and in addition, if there is a problem, it can be submitted
to an existing service that works on sending emails automatically.







Create an .env file with the details below:

PORT=   Choose the port you want to work with

CONN_DB= ״Enter the MongoDb link״

PRIVATE_KEY=״Choose a key that you will use to encrypt the passwords״

API_KEY = "Get a Gemini api key to use their service"


MAIL_HOST="smtp.ethereal.email"

MAIL_SECURE=true

MAIL_USER="For the automatic e-mail service, what will be the e-mail of the manager"

For the e-mail service to work, you must perform two actions: the first is to perform on the e-mail that the e-mail will be available for two-step verification, and the second is to receive a key from the e-mail that will have access to the applications

MAIL_PASS="Here you will enter the key for the email application"
