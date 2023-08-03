import { Router } from "express";
import { allMessages, sendMessage } from "../controllers/message.js";
import { verifyToken } from "../middleware/auth.js";
import { get } from "mongoose";

const router = Router();

router.route("/:chatId").get(verifyToken, allMessages);
router.route("/").post(verifyToken, sendMessage);


export default router;