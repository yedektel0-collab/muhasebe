import app from "./src/app.js";
import { seedAdmin } from "./scripts/seedAdmin.js";

const PORT = process.env.PORT || 3000;

// Seed admin user if env vars are set
seedAdmin();

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
