import React, { useState, useEffect } from "react";
import UserSelector from "../components/UserSelector";
import ClaimButton from "../components/ClaimButton";
import HistoryTable from "../components/HistoryTable";
import Leaderboard from "../components/Leaderboard";
import toast from "react-hot-toast";
import { addUser, claimPoints, getLeaderboard } from "../services/api";
import io from "socket.io-client";

const isDev = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV;
const socketBase = (import.meta.env && import.meta.env.VITE_SOCKET_URL) || (isDev ? "http://localhost:5000" : window.location.origin);
const socket = io(socketBase, { transports: ["websocket", "polling"] });

const Home = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [rankings, setRankings] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const leaderboardResponse = await getLeaderboard();
        console.log("Leaderboard Response:", leaderboardResponse);
        const leaderboardData = Array.isArray(leaderboardResponse.data)
          ? leaderboardResponse.data
          : Array.isArray(leaderboardResponse.data?.items)
          ? leaderboardResponse.data.items
          : [];
        setRankings([...leaderboardData]);
        const uniqueUsers = [
          ...new Map(
            leaderboardData.map((item) => [String(item.id), { id: String(item.id), name: item.name }])
          ).values(),
        ];
        console.log("Derived Users:", uniqueUsers);
        setUsers(uniqueUsers);
      } catch (error) {
        toast.error("Failed to fetch data");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    socket.on("claim:created", (data) => {
      console.log("Socket Claim Data:", data);
      fetchLeaderboard(); // Refresh leaderboard on claim
    });

    socket.on("users:changed", () => {
      fetchData();
    });

    return () => {
      socket.off("claim:created");
      socket.off("users:changed");
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await getLeaderboard();
      console.log("Leaderboard Fetch Response:", response);
      const leaderboardData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.items)
        ? response.data.items
        : [];
      setRankings([...leaderboardData]);
      const uniqueUsers = [
        ...new Map(
          leaderboardData.map((item) => [String(item.id), { id: String(item.id), name: item.name }])
        ).values(),
      ];
      console.log("Updated Users from Fetch:", uniqueUsers);
      setUsers(uniqueUsers);
    } catch (error) {
      console.error("Failed to update leaderboard:", error);
      toast.error("Failed to update leaderboard");
    }
  };

  const handleAddUser = async () => {
    if (!newUser.trim()) {
      toast.error("User name cannot be empty!");
      return;
    }
    try {
      setAdding(true);
      await addUser({ name: newUser.trim() });
      setNewUser("");
      toast.success("User added successfully!");
      fetchLeaderboard(); // Refresh data to include new user
    } catch (error) {
      const message = error?.response?.data?.error || error?.message || "Failed to add user";
      toast.error(message);
    }
    finally {
      setAdding(false);
    }
  };

  const handleClaim = async () => {
    if (!selectedUser) {
      toast.error("Please select a user first!");
      return;
    }
    try {
      const response = await claimPoints(selectedUser);
      const data = response?.data || {};
      const userName = data?.user?.name || "User";
      const points = typeof data?.points === "number" ? data.points : 0;
      toast.success(`${userName} claimed ${points} points!`);
      fetchLeaderboard(); // Ensure leaderboard updates after claim
    } catch (error) {
      console.error("Failed to claim points:", error);
      toast.error("Failed to claim points");
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 drop-shadow-md">Rewards Dashboard</h1>
        <form
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center bg-white p-4 sm:p-6 rounded-xl shadow-lg"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddUser();
          }}
        >
          <input
            type="text"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
            placeholder="Enter new user"
            className="w-full sm:flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={adding}
            className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            {adding ? "Adding..." : "Add User"}
          </button>
        </form>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <UserSelector users={users} setSelectedUser={setSelectedUser} />
          <ClaimButton onClaim={handleClaim} disabled={!selectedUser} />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Leaderboard rankings={rankings} />
          <HistoryTable />
        </div>
      </div>
    </div>
  );
};

export default Home;