const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // <-- path to your User model

async function createAdmin() {
  // await mongoose.connect("mongodb://localhost:27017/yourdbname"); // change db name if needed
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/erp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


  const hashedPassword = await bcrypt.hash("adminpass", 10);

  await User.create({
    username: "admin",
    password: hashedPassword,
    role: "admin",
  });

  console.log("✅ Admin user created");
  mongoose.disconnect();
}

createAdmin();

