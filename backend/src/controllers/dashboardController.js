import Expense from "../models/Expense.js";
import Group from "../models/Group.js";

/* ===================== HELPER ===================== */
/**
 * For a given group, returns only expenses AFTER the last settlement.
 * If no settlement exists, returns all non-settlement expenses.
 */
const splitEqually = (total, users) => {
  const totalPaise = Math.round(total * 100);

  const base = Math.floor(totalPaise / users);
  const remainder = totalPaise % users;

  const splits = [];

  for (let i = 0; i < users; i++) {
    let value = base;

    if (i < remainder) {
      value += 1;
    }

    splits.push(value / 100);
  }

  return splits;
};
// const getExpensesAfterLastSettlement = async (groupId) => {
//   const latestSettlement = await Expense.findOne({
//     group: groupId,
//     description: "Settlement",
//   }).sort({ createdAt: -1 });

//   const query = {
//     group: groupId,
//     description: { $ne: "Settlement" },
//     ...(latestSettlement && { createdAt: { $gt: latestSettlement.createdAt } }),
//   };

//   return Expense.find(query).populate("paidBy").populate("splits.user");
// };

/**
 * Calculates per-user balance map from a list of expenses.
 * Positive = net creditor (others owe you), Negative = net debtor (you owe others).
 */
const calculateDetailedBalances = (expenses, userId) => {
  let youGet = 0;
  let youOwe = 0;

  expenses.forEach((expense) => {
    if (!expense.splits || !expense.paidBy) return;

    const paidById = expense.paidBy._id.toString();

    expense.splits.forEach((split) => {
      const splitUserId = split.user._id.toString();
      const amount = Math.round(split.amount * 100) / 100;

      // 🟢 YOU PAID → others owe you
      if (paidById === userId && splitUserId !== userId) {
        youGet += amount;
      }

      // 🔴 SOMEONE ELSE PAID → you owe them
      if (paidById !== userId && splitUserId === userId) {
        youOwe += amount;
      }
    });
  });

  return {
    youGet: Number(youGet.toFixed(2)),
    youOwe: Number(youOwe.toFixed(2)),
  };
};


/* ===================== SETTLE ALL ===================== */
export const settleAllDashboard = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const groups = await Group.find({ members: userId });

    for (const group of groups) {
      // const expenses = await getExpensesAfterLastSettlement(group._id);
      const expenses = await Expense.find({
  group: group._id,
})
  .populate("paidBy")
  .populate("splits.user");

      // STEP 1: Calculate balances for this group
      const balances = calculateBalances(expenses);

      // STEP 2: Get current user's balance in this group
      let myBalance = balances[userId] || 0;

      // Nothing to settle in this group
      if (Math.abs(myBalance) < 0.01) continue;

      // STEP 3: Settle with relevant users
      for (const [uid, balance] of Object.entries(balances)) {
        if (uid === userId) continue;

        // 🟢 THEY OWE YOU — create a settlement where they pay you
        if (myBalance > 0 && balance < 0) {
          const amount = Math.min(myBalance, Math.abs(balance));
          if (amount <= 0.01) continue;

          const finalAmount = Number(amount.toFixed(2));

          await Expense.create({
            group: group._id,
            paidBy: uid,           // debtor pays
            amount: finalAmount,
            description: "Settlement",
            splits: [{ user: userId, amount: finalAmount }], // you receive
          });

          myBalance -= finalAmount;
        }

        // 🔴 YOU OWE THEM — create a settlement where you pay them
        else if (myBalance < 0 && balance > 0) {
          const amount = Math.min(Math.abs(myBalance), balance);
          if (amount <= 0.01) continue;

          const finalAmount = Number(amount.toFixed(2));

          await Expense.create({
            group: group._id,
            paidBy: userId,        // you pay
            amount: finalAmount,
            description: "Settlement",
            splits: [{ user: uid, amount: finalAmount }], // they receive
          });

          myBalance += finalAmount;
        }

        if (Math.abs(myBalance) < 0.01) break;
      }
    }

    res.json({ message: "Your balances settled successfully" });
  } catch (error) {
    console.error("SETTLE ALL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===================== DASHBOARD STATS ===================== */
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const groups = await Group.find({ members: userId });

    let totalYouGet = 0;
    let totalYouOwe = 0;
    let monthlySpending = 0;

    for (const group of groups) {
      const expenses = await Expense.find({
        group: group._id,
      })
        .populate("paidBy")
        .populate("splits.user");

      expenses.forEach((expense) => {
        const paidById = expense.paidBy._id.toString();

        // ✅ MONTHLY SPENDING LOGIC (CORRECT PLACE)
        const expenseDate = new Date(expense.createdAt);

        if (
          expenseDate >= startOfMonth &&
          expense.description !== "Settlement" &&
          paidById === userId
        ) {
          monthlySpending += Number(expense.amount);
        }

        expense.splits.forEach((split) => {
          const splitUserId = split.user._id.toString();
          const amount = Math.round(split.amount * 100) / 100;

          // 🔥 HANDLE SETTLEMENT
          if (expense.description === "Settlement") {
            if (paidById === userId) {
              totalYouOwe -= amount;
            }

            if (splitUserId === userId) {
              totalYouGet -= amount;
            }

            return;
          }

          // 🟢 NORMAL EXPENSE
          if (paidById === userId && splitUserId !== userId) {
            totalYouGet += amount;
          }

          if (paidById !== userId && splitUserId === userId) {
            totalYouOwe += amount;
          }
        });
      });
    }

    // ✅ FINAL CLEANUP
    totalYouGet = Math.max(0, totalYouGet);
    totalYouOwe = Math.max(0, totalYouOwe);
    monthlySpending = Number(monthlySpending.toFixed(2));

    const net = Number((totalYouGet - totalYouOwe).toFixed(2));

    res.json({
      youGet: Number(totalYouGet.toFixed(2)),
      youOwe: Number(totalYouOwe.toFixed(2)),
      net,
      monthlySpending,
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
/* ===================== MONTHLY NET BALANCE ===================== */
export const getMonthlyNetBalance = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const groups = await Group.find({ members: userId });

    const now = new Date();

    // Initialize last 6 months
    const monthly = {};
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const key = `${date.getFullYear()}-${month}`;
      monthly[key] = { paid: 0, share: 0, net: 0 };
    }

    for (const group of groups) {
      // ✅ Respect settlement cycle — only look at expenses after last settlement
      // const expenses = await getExpensesAfterLastSettlement(group._id);
      const expenses = await Expense.find({
  group: group._id,
})
  .populate("paidBy")
  .populate("splits.user");

      expenses.forEach((expense) => {
        if (!expense.splits) return;

        const expenseDate = new Date(expense.createdAt);
        const month = String(expenseDate.getMonth() + 1).padStart(2, "0");
        const key = `${expenseDate.getFullYear()}-${month}`;

        if (!monthly[key]) return;

        const paidById = expense.paidBy._id
          ? expense.paidBy._id.toString()
          : expense.paidBy.toString();

        const userSplit = expense.splits.find((s) => {
          const splitUserId = s.user._id
            ? s.user._id.toString()
            : s.user.toString();
          return splitUserId === userId;
        });

        if (!userSplit) return;

        const splitAmount = Math.round(userSplit.amount * 100) / 100;

        if (paidById === userId) {
          // You paid — you're owed back your share from others
          monthly[key].paid += Number(expense.amount);
          monthly[key].net += (expense.amount - splitAmount); // your own share doesn't count as net gain
        } else {
          // Someone else paid — you owe your share
          monthly[key].share += splitAmount;
          monthly[key].net -= splitAmount;
        }
      });
    }

    // Round all values
    Object.keys(monthly).forEach((key) => {
      monthly[key].paid = Number(monthly[key].paid.toFixed(2));
      monthly[key].share = Number(monthly[key].share.toFixed(2));
      monthly[key].net = Number(monthly[key].net.toFixed(2));
    });

    res.json(monthly);
  } catch (error) {
    console.error("MONTHLY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ===================== RECENT ACTIVITY ===================== */
export const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user._id;

    const expenses = await Expense.find({
      $or: [
        { paidBy: userId },
        { "splits.user": userId },
      ],
    })
      .populate("paidBy", "name")
      .populate("splits.user", "name")
      .populate("group", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    // 🔥 TRANSFORM INTO ACTIVITY FORMAT
    const activities = expenses.map((exp) => {
      const isSettlement = exp.description === "Settlement";

      return {
        _id: exp._id,
        type: isSettlement ? "settlement" : "expense",
        amount: exp.amount,
        group: exp.group?.name || "No Group",
        createdAt: exp.createdAt,

        // 🔥 CLEAN TITLE
        title: isSettlement
          ? `${exp.paidBy.name} settled`
          : `${exp.paidBy.name} added ${exp.description || "expense"}`,
      };
    });

    res.json(activities);
  } catch (error) {
    console.error("ACTIVITY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};