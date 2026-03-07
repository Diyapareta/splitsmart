import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

import GroupHeader from "../components/Group/GroupHeader";
import MembersSection from "../components/Group/MembersSection";
import AddExpenseForm from "../components/Group/AddExpenseForm";
import BalanceSection from "../components/Group/BalanceSection";
import SettlementSection from "../components/Group/SettlementSection";
import ExpensesSection from "../components/group/ExpensesSection";

export default function GroupDetails() {
  const { groupId } = useParams();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
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

    try {
      await api.post("/expenses", {
        groupId,
        description: form.description,
        amount: Number(form.amount),
        participants: group.members.map((m) => m._id),
      });

      setForm({ description: "", amount: "" });
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
    <div className="p-6 md:p-10">
      <GroupHeader group={group} />

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
      />

      <BalanceSection balances={balances} />

      <SettlementSection
        settlements={settlements}
        handleSettle={handleSettle}
      />

      <ExpensesSection expenses={expenses} handleDelete={handleDelete} />
    </div>
  );
}
