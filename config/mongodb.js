const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
});

mongoose.connection.on("connected", () =>
  console.log(`Mongodb connected to db "${process.env.DB_NAME}"`)
);

mongoose.connection.on("error", () => console.log(`Failed connection to db: "${process.env.DB_NAME}"`));
