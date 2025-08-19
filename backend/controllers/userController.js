// controllers/userController.js
import User from "../models/User.js";
import History from "../models/History.js";

/** Get leaderboard with ranks */
export const getLeaderboard = async (req, res) => {
  const users = await User.find().sort({ totalPoints: -1, createdAt: 1 });
  const leaderboard = users.map((u, i) => ({
    id: u._id,
    name: u.name,
    totalPoints: u.totalPoints,
    rank: i + 1
  }));
  res.json(leaderboard);
};

/** Add a new user */
export const addUser = async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: "Name required" });

  const exists = await User.findOne({ name: new RegExp(`^${name}$`, "i") });
  if (exists) return res.status(409).json({ error: "User already exists" });

  const user = await User.create({ name: name.trim() });
  // Notify sockets
  req.io.emit("users:changed");
  res.json(user);
};

/** Claim random points for a user */
export const claimPoints = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const points = Math.floor(Math.random() * 10) + 1; // 1..10
  user.totalPoints += points;
  await user.save();

  const historyEntry = await History.create({ userId: user._id, points });

  // Notify sockets (update leaderboard + history)
  req.io.emit("claim:created", { id: String(historyEntry._id), userId: String(user._id), userName: user.name, points });

  res.json({ historyId: String(historyEntry._id), user: { id: user._id, name: user.name, totalPoints: user.totalPoints }, points });
};

/** Get claim history (latest first) */
export const getHistory = async (req, res) => {
  const limit = Math.min(Number(req.query.limit || 50), 200);
  const skip = Math.max(Number(req.query.skip || 0), 0);

  const [items, total] = await Promise.all([
    History.find()
      .populate("userId", "name")
      .sort({ claimedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    History.countDocuments()
  ]);

  res.json({
    total,
    items: items.map(h => ({
      id: h._id,
      userId: h.userId?._id,
      userName: h.userId?.name || "Unknown",
      points: h.points,
      claimedAt: h.claimedAt
    }))
  });
};

/** Seed: create initial 10 users once */
export const seedUsers = async (req, res) => {
  const base = ["Rahul", "Kamal", "Sanak", "Aarav", "Diya", "Ishaan", "Meera", "Sara", "Laksh", "Ananya"];
  const existing = await User.countDocuments();
  if (existing) return res.json({ message: "Users already exist", count: existing });

  await User.insertMany(base.map(name => ({ name })));
  req.io.emit("users:changed");
  res.json({ message: "Seeded 10 users", names: base });
};