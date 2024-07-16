# fomofactory
Developed this project using Ubuntu 22.04.2 LTS
Node.js v20.15.1

## Backend
### SETUP DATABASE
https://www.mongodb.com/docs/manual/installation/ [Install Mongodb]

To create a default administrative user

mongo // Access MongoDB Shell
use admin // Switch to Admin Database
db.createUser({ // Create Administrative User
  user: "admin",
  pwd: "admin",
  roles: [{ role: "root", db: "admin" }]
})
db.getUsers() //  Verify User Creation

cd /backend
npx tsc --watch // for compilation
npm run start 