import app from "./app.js";
import { connectDatabase } from "./config/database.js";

connectDatabase(); //database connected here


//app listening here
app.listen(process.env.PORT, () => {
  console.log(`server is running on: ${process.env.PORT}`);
});
