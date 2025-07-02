import express from "express";
import { tokenChecker } from "../middleware/tokenChecker";
import { addBankCard, getBankCard } from "../controllers/bankCardController";

const bankCardRouter = express.Router();

bankCardRouter.post("/", tokenChecker, addBankCard);

bankCardRouter.get("/", tokenChecker, getBankCard);

export default bankCardRouter;
