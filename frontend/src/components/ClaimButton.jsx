import React from "react";

const ClaimButton = ({ onClaim, disabled }) => {
  return (
    <button
      onClick={onClaim}
      disabled={disabled}
      className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 hover:bg-blue-600 hover:shadow-lg active:scale-95 ease-out hover:cursor-pointer"
    >
      Claim Points
    </button>
  );
};

export default ClaimButton;
