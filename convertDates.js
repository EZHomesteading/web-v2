const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
async function convertDates() {
  // const uri = "";
  const client = new MongoClient(uri);
  const saltRounds = 10;
  try {
    await client.connect();
    const database = client.db("ezhDb");
    const collection = database.collection("User");

    await collection.updateMany({}, [
      {
        $set: {
          createdAt: { $toDate: "$createdAt" },
          updatedAt: { $toDate: "$updatedAt" },
        },
      },
    ]);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await collection.updateMany({}, { $set: { password: hashedPassword } });
    console.log("Dates converted successfully.");
  } catch (error) {
    console.error("Error converting dates:", error);
  } finally {
    await client.close();
  }
}

convertDates();
