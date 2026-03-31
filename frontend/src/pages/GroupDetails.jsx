import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

import GroupHeader from "../components/group/GroupHeader";
import MembersSection from "../components/group/MembersSection";
import BalanceSection from "../components/group/BalanceSection";
import SettlementSection from "../components/group/SettlementSection";
import ExpensesSection from "../components/group/ExpensesSection";
import AddExpenseForm from "../components/group/AddExpenseForm";

export default function GroupDetails() {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [splitType, setSplitType] = useState("equal");
  const [customSplits, setCustomSplits] = useState({});
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    description: "",
    amount: "",
  });

  const [memberEmail, setMemberEmail] = useState("");

  // =========================
  // Fetch Group Data
  // =========================
  const fetchGroupData = async () => {
    try {
      const groupRes = await api.get(`/groups/${groupId}`);
      setGroup(groupRes.data);

      const expenseRes = await api.get(`/expenses/${groupId}`);
      setExpenses(expenseRes.data);

      const balanceRes = await api.get(`/expenses/balances/${groupId}`);
      setBalances(balanceRes.data);

      const settlementRes = await api.get(`/expenses/settle/${groupId}`);
      setSettlements(settlementRes.data);
    } catch (error) {
      if (error.response?.status === 404) {
        navigate("/groups"); // 🔥 redirect if group deleted
      }
    }
  };
  useEffect(() => {
    fetchGroupData();
  }, [groupId]);
  useEffect(() => {
    if (group) {
      setSelectedParticipants(group.members.map((m) => m._id));
    }
  }, [group]);
  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Add Expense
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Minimal validation
    if (!form.amount || Number(form.amount) <= 0) {
      return alert("Enter valid amount");
    }
    if (selectedParticipants.length === 0) {
      return alert("Select at least one participant");
    }
    if (splitType === "custom") {
      const total = Object.values(customSplits).reduce(
        (acc, val) => acc + Number(val || 0),
        0,
      );

      if (total !== Number(form.amount)) {
        return alert("Split must equal total amount");
      }
    }
    try {
      let participants = selectedParticipants;

      let splitsData = null;

      if (splitType === "custom") {
        splitsData = customSplits;
      }
      if (selectedParticipants.length === 0) {
        return alert("Select at least one participant");
      }

      await api.post("/expenses", {
        groupId,
        description: form.description || "No description",
        amount: Number(form.amount),
        participants,
        splitType,
        splitsData,
      });

      // ✅ reset form (same structure as before)
      setForm({
        description: "",
        amount: "",
      });

      setShowForm(false);

      await fetchGroupData();
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  };
  // =========================
  // Delete Expense
  // =========================
  const handleDelete = async (expenseId) => {
    try {
      await api.delete(`/expenses/${expenseId}`);
      await fetchGroupData();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  // =========================
  // Handle Settlement
  // =========================
  const handleSettle = async (settlement) => {
    try {
      await api.post(`/expenses/settle/${groupId}`, {
        fromName: settlement.from,
        toName: settlement.to,
        amount: settlement.amount,
      });

      await fetchGroupData();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  // =========================
  // Add Member
  // =========================
  const handleAddMember = async () => {
    try {
      const res = await api.put(`/groups/${groupId}/add-member`, {
        email: memberEmail,
      });

      setGroup(res.data);
      setMemberEmail("");
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  // =========================
  // Loading Protection
  // =========================
  if (!group) {
    return <div className="p-10 text-gray-600">Loading group...</div>;
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
      {/* Header */}
      <button
        onClick={() => navigate("/groups")}
        className="mb-4 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2"
      >
        ← Back to Groups
      </button>
      <GroupHeader group={group} />

      {/* Members */}
      <MembersSection
        group={group}
        memberEmail={memberEmail}
        setMemberEmail={setMemberEmail}
        handleAddMember={handleAddMember}
      />
      <AddExpenseForm
        showForm={showForm}
        setShowForm={setShowForm}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        expenses={expenses}
        group={group}
        splitType={splitType}
        setSplitType={setSplitType}
        customSplits={customSplits}
        setCustomSplits={setCustomSplits}
        selectedParticipants={selectedParticipants}
        setSelectedParticipants={setSelectedParticipants}
      />
      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          Total Expenses:{" "}
          <span className="text-white font-medium ml-1">
            ₹{expenses.reduce((acc, e) => acc + e.amount, 0)}
          </span>
        </p>
      </div>

      {/* Balance + Settlement (SIDE BY SIDE) */}
      <div className="grid md:grid-cols-2 gap-4">
        <BalanceSection balances={balances} />

        <SettlementSection
          settlements={settlements}
          handleSettle={handleSettle}
        />
      </div>

      {/* Expenses */}
      <ExpensesSection
        expenses={expenses}
        handleDelete={handleDelete}
        onSelect={(expense) => setSelectedExpense(expense)}
      />
      {selectedExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#15151a] p-6 rounded-xl w-80">
            <h2 className="text-lg font-semibold mb-2">
              {selectedExpense.description}
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              Paid by {selectedExpense.paidBy.name}
            </p>

            <div className="space-y-2">
              {selectedExpense.splits.map((split) => (
                <div
                  key={split.user._id}
                  className="flex justify-between text-sm"
                >
                  <span>{split.user.name}</span>
                  <span>₹{split.amount}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedExpense(null)}
              className="mt-4 w-full bg-gray-700 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
