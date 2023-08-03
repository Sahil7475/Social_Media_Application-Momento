import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
    searchUsers,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", getUser);
router.get("/", verifyToken, searchUsers);
router.get("/:id/friends", getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", addRemoveFriend);

export default router;