import { createError } from "../error.js";
import db from "../models/index.js";

const BankUser = db.bankUser;
const Loan = db.loan;

export const createBankUser = async (req, res, next) => {
    const users = req.body;
    try {
        users.map(async(user)=> {
            await BankUser.create(user)
        })
        const userTable = await BankUser.findAll();
        return res.json(userTable); 
    } catch (error) {
        return next(createError(error.status, error.message));
    }
}

export const createLoan = async (req, res, next) => {
    const loans = req.body.loans;
    const acc_no = req.params.id;
    try {
        const bankUser = await BankUser.findOne({
            where: {
                account_number: acc_no,
            },
        });

        if (!bankUser) {
            return next(createError(404, "Bank user not found"));
        }
        const createdLoans = await Promise.all(
              loans.map(async (loan) => {
                const newLoan = await Loan.create(loan);
                await newLoan.setbankUser(bankUser);
                return newLoan;
              })
            );
        // loans.map(async (loan) => {
        //     await Loan.create(loan)
        //     await loan.setbankUser(bankUser);
        // })
        const loanTable = await Loan.findAll(); // Fetch all loans for response
        return res.json(loanTable)
    } catch (error) {
        return next(createError(error.status, error.message));
    }
}