import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
// import server from "./server";
import { CONFIG } from "./server/config";
import { server } from "./server/socket";

const env = dotenv.config({ path: `${__dirname}/.env` });
dotenvExpand.expand(env);

const PORT: number = CONFIG.PORT || 3001;

try {
  server.listen(PORT, () => console.log(`Server is live at localhost:${PORT}`));
} catch (error) {
  console.log('Cannot connect to the server');
}
