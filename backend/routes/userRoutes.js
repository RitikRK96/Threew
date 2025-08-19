// routes/userRoutes.js
import express from "express";
import { getLeaderboard, addUser, claimPoints, getHistory, seedUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.get("/history", getHistory);
router.post("/add", addUser);
router.post("/claim/:userId", claimPoints);

// one-time seed route (call once)
router.post("/seed", seedUsers);


export default router;