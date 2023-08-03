import { Router } from "express";
import { accessChat, fetchChats, createGroupChat, removeFromGroup, addToGroup, renameGroup } from "../controllers/chat.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.route("/").post(verifyToken, accessChat);
router.route("/").get(verifyToken, fetchChats);
router.route("/group").post(verifyToken, createGroupChat);
router.route("/rename").put(verifyToken, renameGroup);
router.route("/groupremove").put(verifyToken, removeFromGroup);
router.route("/groupadd").put(verifyToken, addToGroup);

export default router;