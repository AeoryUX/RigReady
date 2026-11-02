import { Router, type IRouter } from "express";

const router: IRouter = Router();

// Retain a clear response for older clients; this route no longer calls an AI provider.
router.post("/pc-advisor/upgrade-plan", (_req, res) => {
  res.status(410).json({
    error: "The old upgrade-plan service has been retired. Use RigReady’s hosted shop search to compare listings.",
  });
});

export default router;
