import { type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  crons: [
    // Daily sweep of orphan blobs left behind by Vercel-killed processing.
    // Schedule: 03:30 UTC. Requires CRON_SECRET env var.
    { path: "/api/cron/cleanup", schedule: "30 3 * * *" },
  ],
};
