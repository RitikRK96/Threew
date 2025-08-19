import React, { useState, useEffect } from "react";
import { getHistory } from "../services/api";
import io from "socket.io-client";

const isDev =
  typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV;
const socketBase =
  (import.meta.env && import.meta.env.VITE_SOCKET_URL) ||
  (isDev ? "http://localhost:5000" : window.location.origin);
const socket = io(socketBase, { transports: ["websocket", "polling"] });

const HistoryTable = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 20;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getHistory({ limit: PAGE_SIZE, skip: 0 });
        setHistory(response.data.items || []);
        setTotal(response.data.total || 0);
        setSkip((response.data.items || []).length);
      } catch (err) {
        setError("Failed to fetch history data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

    socket.on("claim:created", (data) => {
      setHistory((prev) => [
        {
          id: data.id,
          userId: data.userId,
          userName: data.userName,
          points: data.points,
          claimedAt: new Date(),
        },
        ...prev,
      ]);
      setTotal((t) => t + 1);
      setSkip((s) => s + 1);
    });

    return () => socket.off("claim:created");
  }, []);

  if (loading)
    return <div className="text-center text-gray-600 py-3">Loading...</div>;
  if (error)
    return <div className="text-center text-red-600 py-3">{error}</div>;

  return (
    <div className="bg-white p-3 rounded-lg shadow max-w-full">
      <h2 className="text-lg font-semibold mb-2 text-gray-800 text-center md:text-left">
        Claim History
      </h2>

      {/* Mobile (cards) */}
      <div className="md:hidden flex flex-col gap-2">
        {history.length === 0 ? (
          <div className="text-center p-2 text-gray-500 bg-gray-50 rounded">
            No claims yet
          </div>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              className="flex justify-between items-center p-2 bg-gray-50 border rounded hover:bg-gray-100 transition-colors"
            >
              <div>
                <div className="font-medium text-gray-800 text-sm">
                  {entry.userName}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(entry.claimedAt).toLocaleString()}
                </div>
              </div>
              <div className="text-green-600 font-semibold text-sm">
                {entry.points}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop (table) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-fixed border-collapse text-sm text-center">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-2 py-1 border w-1/4">User</th>
              <th className="px-2 py-1 border w-1/6">Points</th>
              <th className="px-2 py-1 border w-2/4">Date</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-2 text-gray-500">
                  No claims yet
                </td>
              </tr>
            ) : (
              history.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="border px-2 py-1 truncate">
                    {entry.userName}
                  </td>
                  <td className="border px-2 py-1">{entry.points}</td>
                  <td className="border px-2 py-1 truncate">
                    {new Date(entry.claimedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Load More Button */}
      {history.length < total && (
        <div className="flex justify-center mt-2">
          <button
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            onClick={async () => {
              try {
                setLoadingMore(true);
                const res = await getHistory({ limit: PAGE_SIZE, skip });
                const items = res.data.items || [];
                setHistory((prev) => [...prev, ...items]);
                setSkip(skip + items.length);
                setTotal(res.data.total || total);
              } catch (e) {
                console.error(e);
              } finally {
                setLoadingMore(false);
              }
            }}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
