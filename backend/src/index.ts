
/**
 * Other Imports
 */
import app from "./app";
import { env } from "./config";

const port = env.PORT || 8000;

try {
    app.listen(port, () => {
        console.log(`App Is Running at http://localhost:${port}`);
    });
} catch (err) {
    console.log(`Internal Server Error`);
}
