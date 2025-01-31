"use client";

import React, { useState } from "react";

const Page = () => {
  const [filename, setFilename] = useState("");
  const [vectorIds, setVectorIds] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCount = async () => {
    try {
      setMessage("");
      setError("");

      const response = await fetch("/api/count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      setVectorIds(data.ids); // Assuming the API returns an array of IDs
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  const handleDelete = async (id) => {
    try {
      setMessage("");
      setError("");

      const response = await fetch("/api/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }), // Send the ID of the vector to delete
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();
      setMessage(`Deleted vector with ID: ${id}`);
      setVectorIds((prevIds) => prevIds.filter((vectorId) => vectorId !== id)); // Remove deleted ID from the list
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Manage Vectors</h1>
      <input
        type="text"
        placeholder="Enter Filename"
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      <button
        onClick={handleCount}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        Count Vectors
      </button>
      {vectorIds.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl">Vector IDs:</h2>
          <ul>
            {vectorIds.map((id) => (
              <li key={id} className="flex justify-between items-center">
                <span>{id}</span>
                <button
                  onClick={() => handleDelete(id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default Page;
