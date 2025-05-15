// Creates a new MongoDB user with the specified credentials and roles
db.createUser({
  user: process.env.MONGO_USERNAME,  // Username is taken from the environment variable MONGO_USERNAME
  pwd: process.env.MONGO_PASSWORD,   // Password is taken from the environment variable MONGO_PASSWORD
  roles: [
    {
      role: "readWrite",             // Grants read and write access
      db: "calculatorDB"             // On the 'calculatorDB' database
    }
  ]
});
