import React from "react";

const Leaderboard = ({ rankings }) => {
  // Ensure rankings is an array, default to empty array if undefined or invalid
  const validRankings = Array.isArray(rankings) ? rankings : [];
  const safeTopThree = validRankings.slice(0, 3).filter((i) => i && typeof i.totalPoints === "number");
  const safeRest = validRankings.slice(3).filter((i) => i && typeof i.totalPoints === "number");

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-yellow-800">Weekly Contribution Ranking</h1>
        <p className="text-xs sm:text-sm text-gray-600">Settlement Time: 2 days - 01:45:29</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {safeTopThree.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-lg text-center transition-transform duration-200 ease-out hover:shadow-md hover:-translate-y-0.5 ${
              item.rank === 1 ? "bg-yellow-200" : item.rank === 2 ? "bg-gray-200" : "bg-gray-100"
            }`}
          >
            <div className="text-2xl font-bold text-yellow-800">{item.rank}</div>
            <div className="text-sm font-semibold mt-2">{item.name}</div>
            <div className="text-lg text-green-600 mt-1">{item.totalPoints.toLocaleString()}</div>
            <span role="img" aria-label="trophy" className="text-2xl">🏆</span>
          </div>
        ))}
      </div>
      <div className="space-y-3 sm:space-y-4">
        {safeRest.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-100 hover:shadow"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg sm:text-xl font-semibold text-yellow-800">{item.rank}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-600">{item.totalPoints.toLocaleString()}</span>
              <span role="img" aria-label="trophy" className="text-lg">🏆</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;