import { createError } from "../error.js";
import db from "../models/index.js";

const BankUser = db.bankUser;

export const createBankUser = async (req, res, next) => {
    const users = req.body;
    try{
        users.map(async(user)=> {
            await BankUser.create(user)
        })
        const userTable = await BankUser.findAll();
        return res.json(userTable);
    }catch(error) {
        return next(createError(error.status, error.message));
    }
} 