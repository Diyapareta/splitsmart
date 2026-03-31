import Group from "../models/Group.js";
import Expense from "../models/Expense.js";
import User from "../models/User.js";

export const createGroup=async(req,res)=>{
try{
  const{name}=req.body;
  const group =await Group.create({
    name,members:[req.user._id],
    createdBy:req.user._id,
  });
  res.status(201).json(group);
}
catch(error){
  res.status(500).json({message:error.message});
}
}
export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "name email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user._id,
    }).populate("members", "name email");

    res.json(groups);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getGroupBalances = async (req, res) => {
  const group = await Group.findById(groupId);

if (!group) {
  return res.status(404).json({ message: "Group not found" });
}

if (!group.members.includes(req.user._id)) {
  return res.status(403).json({ message: "Not authorized for this group" });
}
if (!group.members.some(
    member => member.toString() === req.user._id.toString()
)) {
  return res.status(403).json({ message: "Not authorized for this group" });
}

  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId });

    const balances = {};

    expenses.forEach((expense) => {
      const paidBy = expense.paidBy.toString();

      if (!balances[paidBy]) {
        balances[paidBy] = 0;
      }

      balances[paidBy] += expense.amount;

      expense.splits.forEach((split) => {
        const userId = split.user.toString();

        if (!balances[userId]) {
          balances[userId] = 0;
        }

        balances[userId] -= split.amount;
      });
    });

    res.json(balances);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const simplifyDebts = async (req, res) => {
  const group = await Group.findById(groupId);

if (!group) {
  return res.status(404).json({ message: "Group not found" });
}

if (!group.members.includes(req.user._id)) {
  return res.status(403).json({ message: "Not authorized for this group" });
}
if (!group.members.some(
    member => member.toString() === req.user._id.toString()
)) {
  return res.status(403).json({ message: "Not authorized for this group" });
}


  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ group: groupId });

    const balances = {};

    // Step 1: Calculate net balances
    expenses.forEach((expense) => {
      const paidBy = expense.paidBy.toString();

      if (!balances[paidBy]) balances[paidBy] = 0;
      balances[paidBy] += expense.amount;

      expense.splits.forEach((split) => {
        const userId = split.user.toString();

        if (!balances[userId]) balances[userId] = 0;
        balances[userId] -= split.amount;
      });
    });

    // Step 2: Separate creditors and debtors
    const creditors = [];
    const debtors = [];

    for (const userId in balances) {
      if (balances[userId] > 0) {
        creditors.push({ userId, amount: balances[userId] });
      } else if (balances[userId] < 0) {
        debtors.push({ userId, amount: -balances[userId] });
      }
    }

    const transactions = [];

    // Step 3: Match greedily
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const minAmount = Math.min(debtor.amount, creditor.amount);

      transactions.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: minAmount,
      });

      debtor.amount -= minAmount;
      creditor.amount -= minAmount;

      if (debtor.amount === 0) i++;
      if (creditor.amount === 0) j++;
    }

    res.json(transactions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicate member
    if (group.members.includes(user._id)) {
      return res.status(400).json({ message: "User already in group" });
    }

    group.members.push(user._id);
    await group.save();

    const updatedGroup = await Group.findById(groupId)
      .populate("members", "name email");

    res.json(updatedGroup);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can delete
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 🔥 DELETE ALL EXPENSES OF THIS GROUP
    await Expense.deleteMany({ group: group._id });

    // 🔥 THEN DELETE GROUP
    await group.deleteOne();

    res.json({ message: "Group and expenses deleted successfully" });

  } catch (error) {
    console.log("DELETE GROUP ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};