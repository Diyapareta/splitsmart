import Expense from "../models/Expense.js";

export const getMonthlyNetBalance = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    // Get expenses where user appears inside splits
    const expenses = await Expense.find({
      "splits.user": userId,
    });

    const monthly = {};

    // Helper to generate last 6 months (including current)
    const now = new Date();
    const lastSixMonths = [];

    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const key = `${date.getFullYear()}-${month}`;
      lastSixMonths.push(key);

      monthly[key] = {
        paid: 0,
        share: 0,
        net: 0,
      };
    }

    // Calculate values
    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.createdAt);
      const month = String(expenseDate.getMonth() + 1).padStart(2, "0");
      const key = `${expenseDate.getFullYear()}-${month}`;

      if (!monthly[key]) return; // ignore older than 6 months

      const userSplit = expense.splits.find(
        (s) => s.user.toString() === userId
      );

      if (!userSplit) return;

      const yourShare = userSplit.amount;

      monthly[key].share += yourShare;

      if (expense.paidBy.toString() === userId) {
        monthly[key].paid += expense.amount;
        monthly[key].net += expense.amount - yourShare;
      } else {
        monthly[key].net -= yourShare;
      }
    });

    res.json(monthly);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};