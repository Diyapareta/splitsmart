import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
export const addExpense=async(req,res)=>{
  try {
    const{groupId,amount,description,participants}=req.body;

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

    const splitAmount=amount/validParticipants.length;

    const splits=validParticipants.map((userId)=>({
      user:userId,
      amount:splitAmount,

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
export const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name email")
      .populate("splits.user", "name email")
      .sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name")
      .populate("splits.user", "name");

    const balances = {};

    expenses.forEach((expense) => {
      const paidById = expense.paidBy._id.toString();

      expense.splits.forEach((split) => {
        const userId = split.user._id.toString();
        const amount = split.amount;

        if (!balances[userId]) {
          balances[userId] = {
            name: split.user.name,
            balance: 0
          };
        }

        if (!balances[paidById]) {
          balances[paidById] = {
            name: expense.paidBy.name,
            balance: 0
          };
        }

        balances[userId].balance -= amount;
        balances[paidById].balance += amount;
      });
    });

    res.json(Object.values(balances));

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
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "name")
      .populate("splits.user", "name");

    const balances = {};

    // Calculate balances
    expenses.forEach((expense) => {
      const paidById = expense.paidBy._id.toString();

      expense.splits.forEach((split) => {
        const userId = split.user._id.toString();
        const amount = split.amount;

        if (!balances[userId]) {
          balances[userId] = {
            name: split.user.name,
            balance: 0
          };
        }

        if (!balances[paidById]) {
          balances[paidById] = {
            name: expense.paidBy.name,
            balance: 0
          };
        }

        balances[userId].balance -= amount;
        balances[paidById].balance += amount;
      });
    });

    const creditors = [];
    const debtors = [];

    Object.values(balances).forEach((person) => {
      if (person.balance > 0) {
        creditors.push({ ...person });
      } else if (person.balance < 0) {
        debtors.push({ ...person });
      }
    });

    const settlements = [];

    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amount = Math.min(
        Math.abs(debtor.balance),
        creditor.balance
      );

      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount
      });

      debtor.balance += amount;
      creditor.balance -= amount;

      if (Math.abs(debtor.balance) < 1) i++;
      if (creditor.balance < 1) j++;
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


