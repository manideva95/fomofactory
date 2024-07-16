# fomofactory
Developed this project using Ubuntu 22.04.2 LTS
Node.js v20.15.1

## Backend
### SETUP DATABASE
https://www.mongodb.com/docs/manual/installation/ [Install Mongodb]

//In this application I have used mongodb change stream so we need to add replica set, below is the docker command to create container with replica set
docker run -d -p 27017:27017 --name mongodb-fomofactory mongo --replSet rs0

go to terminal and in mongosh execute the below command

rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: 'localhost:27017' }]
});

To create a default administrative user
mongo // Access MongoDB Shell
use admin // Switch to Admin Database
// Create Administrative User
db.createUser({ 
  user: "admin",
  pwd: "admin",
  roles: [{ role: "root", db: "admin" }]
})
db.getUsers() //  Verify User Creation

cd /backend
npx tsc --watch // for compilation
npm run start 