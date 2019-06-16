#!/usr/bin/env bash

## Smoke it
curl -d 'from=noreply@sms.com&to=guest@example.com&subject=Hi&text=This service is awesome !' -X POST http://localhost:3003/api/mail
curl -d 'from=noreply@sms.com&to=guest@example.com&subject=Hi&text=This service is awesome !' -X POST http://localhost:3003/api/mail
curl -d 'from=noreply@sms.com&to=guest@example.com&subject=Hi&text=This service is awesome !' -X POST http://localhost:3003/api/mail
curl -d 'from=noreply@sms.com&to=guest@example.com&subject=Hi&text=This service is awesome !' -X POST http://localhost:3003/api/mail
curl -d 'from=noreply@sms.com&to=guest@example.com&subject=Hi&text=This service is awesome !' -X POST http://localhost:3003/api/mail

# Invalid email address
curl -d 'from=noreply@sms.com&to=wrong_email_address&subject=Hi&text=This service is awesome !' -X POST http://localhost:3003/api/mail

# Multiple recipients
curl -d 'from=noreply@sms.com&to=gues1@example.com&to=guest2@example.com&subject=Hi&text=This service is awesome !' -X POST http://localhost:3003/api/mail

# Invoke v2 of the API
curl -d 'from=noreply@sms.com&to=guest1@example.com&subject=Hi&text=This service is awesome !' -X POST http://localhost:3003/api/v2/mail



