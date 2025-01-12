import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/configs/schema.ts",
  dbCredentials: {
    url: 'postgresql://asharmeraj55:Lx2oUfXkQrb9@ep-shiny-sun-a1p1gb20.ap-southeast-1.aws.neon.tech/AI_LMS_SAAS?sslmode=require'
  }
});
