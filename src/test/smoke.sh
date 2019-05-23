#!/usr/bin/env bash

# Smoke it
curl -d 'from=noreply@mail-service.com&to=guest@example.com&subject=Hello&text=This is test!' -X POST http://localhost:3003/api/mail
curl -d 'from=noreply@mail-service.com&to=guest@example.com&subject=Hello&text=This is test!' -X POST http://localhost:3003/api/mail
curl -d 'from=noreply@mail-service.com&to=guest@example.com&subject=Hello&text=This is test!' -X POST http://localhost:3003/api/mail
curl -d 'from=noreply@mail-service.com&to=guest@example.com&subject=Hello&text=This is test!' -X POST http://localhost:3003/api/mail
curl -d 'from=noreply@mail-service.com&to=guest@example.com&subject=Hello&text=This is test!' -X POST http://localhost:3003/api/mail

## Invalid email address
curl -d 'from=noreply@mail-service.com&to=wrong_email_address&subject=Hello&text=This is test!' -X POST http://localhost:3003/api/mail

# Multiple recipients
curl -d 'from=noreply@mail-service.com&to=guest@example.com&to=guest2@example.com&subject=Hello&text=This is test!' -X POST http://localhost:3003/api/mail
