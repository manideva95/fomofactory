# FomoFactory
Developed this project using 
#### Ubuntu 22.04.2 LTS
#### Node.js v20.15.1

## Backend
### SETUP DATABASE
Install database with the instructions given in this link
https://www.mongodb.com/docs/manual/installation/ [Install Mongodb]

### 1. In this application I have used mongodb change stream so we need to add replica set, below is the docker command to create container with replica set
I have used the below command to create docker container, as I am running the mongodb in docker container
```
docker run -d -p 27017:27017 --name mongodb-fomofactory mongo --replSet rs0
```

### 2. Go to terminal and in mongosh execute the below command
```
rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: 'localhost:27017' }]
});
```
### 3. To create a default administrative user
Switch to Admin Database
```
use admin 
```
Create Administrative User
```
db.createUser({ 
  user: "admin",
  pwd: "admin",
  roles: [{ role: "root", db: "admin" }]
})
```
Verify User Creation
```
db.getUsers()
```

### 4. To start backend
```
cd /backend
npm install
```
Run the below watch command in separate window
```
npx tsc --watch
```
Run the below command to start the application
```
npm run start 
```
## FrontEnd

### 1. To start frontend
```
cd /frontend
npm install
npm run dev
```
The application will be started in 
http://localhost:8080/

## Appendix

1. Once the application is running, select a coin in the dropdown in the frontend application, upon selection the socket connection will be established to the backend.
2. Once the socket connection established, in interval of 5 seconds the live price of all the coins are fetched and persisted to mongodb.
3. Using the mongodb change stream the collection is watched for the changes and the live data is emitted via socket connection to frontend.
4. In frontend the live data are once received its stored in redux and updated in UI.
5. I have used coingecko apis to get the coins list and its live prices.
6. Coingecko api key is attached in .env.development and committed along with this project, so it should work fine.

## Support
For support please do reach me out, email manideva6@gmail.com or +91 8072061988.
