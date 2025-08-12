import app from "./app/index.js";
import config from "./config/index.js";

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
