import Expense from "../models/Expense.js";
import Group from "../models/Group.js";

export const addExpense=async(req,res)=>{
  try {
    const { groupId, description, participants, splitType, splitsData } = req.body;
    const amount = Math.round(Number(req.body.amount) * 100) / 100;

     if (!groupId || !amount || !participants || participants.length === 0) {
      return res.status(400).json({
        message: "Group, amount and participants are required",
      });
    }

    const group=await Group.findById(groupId);

    if(!group){
      return res.status(404).json({message:"group not found"});
    }
    const validParticipants=participants.filter((id)=>
      group.members.some(
        (memberId) => memberId.toString() === id.toString()
      )
    );
    if(validParticipants.length===0){
      return res.status(400).json({message:"no valid participants"});
    }

   let splits = [];

if (splitType === "custom" && splitsData) {
  splits = Object.entries(splitsData).map(([userId, amt]) => ({
    user: userId,
    amount: Math.round(Number(amt) * 100) / 100,
  }));

  // ✅ validation
  const total = splits.reduce((acc, s) => acc + s.amount, 0);

  if (Math.abs(total - amount) > 0.01) {
    return res.status(400).json({
      message: "Split must equal total amount",
    });
  }

} else {
  const total = Number(amount);
  const count = validParticipants.length;

  const baseAmount = Math.floor((total / count) * 100) / 100;

  let remaining = total;

  splits = validParticipants.map((userId, index) => {
    if (index === count - 1) {
      return {
        user: userId,
        amount: Number(remaining.toFixed(2)),
      };
    }

    remaining -= baseAmount;

    return {
      user: userId,
      amount: baseAmount,
    };
  });
}
splits = splits.map((s) => ({
  ...s,
  amount: Number(s.amount.toFixed(2)),
}));
    const expense = await Expense.create({
      group: groupId,
      paidBy: req.user._id,
      amount,
      description,
      splits,
    });
    res.status(201).json(expense);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export const getGroupExpenses = async (req, res) =>
   { try { const { groupId } = req.params; const expenses = await Expense.find({ group: groupId }) .populate("paidBy", "name email") .populate("splits.user", "name email") .sort({ createdAt: -1 }); res.json(expenses); } 
catch (error) { res.status(500).json({ message: error.message }); } };
export const getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name")
      .populate("splits.user", "name");

    const balances = {};

    expenses.forEach((expense) => {
      const paidById = expense.paidBy._id.toString();

      // ✅ ROUND expense amount
      const expenseAmount = Math.round(expense.amount * 100) / 100;

      // initialize payer
      if (!balances[paidById]) {
        balances[paidById] = {
          name: expense.paidBy.name,
          balance: 0,
        };
      }

      // add full amount ONCE
      balances[paidById].balance += expenseAmount;

      // subtract each user's share
      expense.splits.forEach((split) => {
        const userId = split.user._id.toString();

        // ✅ ROUND split amount
        const splitAmount = Math.round(split.amount * 100) / 100;

        if (!balances[userId]) {
          balances[userId] = {
            _id: userId,
            name: split.user.name,
            balance: 0,
          };
        }

        balances[userId].balance -= splitAmount;
      });
    });

    // ✅ FINAL ROUNDING (VERY IMPORTANT)
    const result = Object.values(balances).map((user) => ({
      ...user,
      balance: Number(user.balance.toFixed(2)),
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // ❌ Cannot delete settlement record itself
    if (expense.description === "Settlement") {
      return res.status(400).json({
        message: "Cannot delete settlement record"
      });
    }

    // Find latest settlement in this group
    const latestSettlement = await Expense.findOne({
      group: expense.group,
      description: "Settlement"
    }).sort({ createdAt: -1 });

    if (latestSettlement) {
      // If expense was created BEFORE settlement → block
      if (expense.createdAt < latestSettlement.createdAt) {
        return res.status(400).json({
          message: "Cannot delete expenses settled in previous cycle"
        });
      }
    }

    // Only person who paid can delete
    if (expense.paidBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await expense.deleteOne();

    res.json({ message: "Expense deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getSettlementPlan = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name")
      .populate("splits.user", "name");

    const balances = {};

    // ✅ Calculate balances
    expenses.forEach((expense) => {
      const paidById = expense.paidBy._id.toString();

      expense.splits.forEach((split) => {
        const userId = split.user._id.toString();
        const amount = Math.round(split.amount * 100) / 100;

        if (!balances[userId]) {
         balances[userId] = {
  id: userId, // ✅ ADD THIS
  name: split.user.name,
  balance: 0
};
        }

        if (!balances[paidById]) {
          balances[paidById] = {
  id: paidById, // ✅ ADD THIS
  name: expense.paidBy.name,
  balance: 0
};
        }

        balances[userId].balance -= amount;
        balances[paidById].balance += amount;
      });
    });

    // ✅ ROUND balances after calculation
    Object.values(balances).forEach((person) => {
      person.balance = Math.round(person.balance * 100) / 100;
    });

    const creditors = [];
    const debtors = [];

    Object.values(balances).forEach((person) => {
      if (person.balance > 0.01) {
        creditors.push({ ...person });
      } else if (person.balance < -0.01) {
        debtors.push({ ...person });
      }
    });

    const settlements = [];

    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const rawAmount = Math.min(
        Math.abs(debtor.balance),
        creditor.balance
      );

      const amount = Number(rawAmount.toFixed(2)); // ✅ FINAL FIX

     settlements.push({
  from: debtor.name,
  to: creditor.name,
  amount,
  canSettle: debtor.id === currentUserId // ✅ KEY FIX
});

      debtor.balance += amount;
      creditor.balance -= amount;

      // ✅ fix threshold (IMPORTANT)
      if (Math.abs(debtor.balance) < 0.01) i++;
      if (creditor.balance < 0.01) j++;
    }

    res.json(settlements);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const settleDebt = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { fromName, toName, amount } = req.body;

    const group = await Group.findById(groupId).populate("members");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const fromUser = group.members.find(
      (m) => m.name === fromName
    );

    const toUser = group.members.find(
      (m) => m.name === toName
    );

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const settlementExpense = await Expense.create({
      group: groupId,
      paidBy: fromUser._id,
      amount,
      description: "Settlement",
      splits: [
        {
          user: toUser._id,
          amount,
        },
      ],
    });

    res.json({ message: "Debt settled", settlementExpense });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGroupedBalances = async (req, res) => {
  try {
    
    const userId = req.user?._id?.toString();
    

    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    const groups = await Group.find({ members: userId });

    const result = [];

    for (const group of groups) {
      const expenses = await Expense.find({ group: group._id })
        .populate("paidBy", "name")
        .populate("splits.user", "name");

      const balances = {};

      expenses.forEach((expense) => {
        if (!expense.paidBy) return;

        const paidById = expense.paidBy._id?.toString();
        const paidByName = expense.paidBy.name;

        expense.splits.forEach((split) => {
  if (!split.user) return;

  const splitUserId = split.user._id.toString();
  const splitUserName = split.user.name;
  const amount = Number(
    (Math.round(split.amount * 100) / 100).toFixed(2)
  );

  // 🔥 CASE 1: YOU PAID
  if (paidById === userId && splitUserId !== userId) {
    if (!balances[splitUserId]) {
      balances[splitUserId] = {
        _id: splitUserId,
        name: splitUserName,
        balance: 0,
      };
    }

    // Others owe YOU → positive
    balances[splitUserId].balance += amount;
  }

  // 🔥 CASE 2: SOMEONE ELSE PAID FOR YOU
  else if (splitUserId === userId && paidById !== userId) {
    if (!balances[paidById]) {
      balances[paidById] = {
        _id: paidById,
        name: paidByName,
        balance: 0,
      };
    }

    // YOU owe them → negative
    balances[paidById].balance -= amount;
  }
});
      });

      const members = Object.values(balances)
  .filter((u) => u._id.toString() !== userId.toString()) // 🔥 REMOVE SELF
  .map((u) => ({
    ...u,
    balance: Number(u.balance.toFixed(2)),
  }));

      result.push({
        _id: group._id,
        name: group.name,
        members,
      });
    }

    res.json(result);
  } catch (error) {
    console.error("GROUPED BALANCE ERROR:", error); // 🔥 IMPORTANT
    res.status(500).json({ message: error.message });
  }
};
export const settleExpense = async (req, res) => {
  try {
    const { fromUserId, toUserId, amount } = req.body;

    if (!fromUserId || !toUserId || !amount) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 🔥 Create settlement as expense
    const settlement = await Expense.create({
      group: null, // or optional
      amount,
      description: "Settlement",
      paidBy: fromUserId,
      splits: [
        {
          user: toUserId,
          amount,
        },
      ],
    });

    res.json({ message: "Settlement successful", settlement });
  } catch (err) {
    console.error("SETTLEMENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};