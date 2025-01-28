"use client";

import { useState } from "react";
import { deleteChunksFromPinecone } from "@/lib/pinecone-client";

export default function DeleteFile() {
  const [filename, setFilename] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (event) => {
    setFilename(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await deleteChunksFromPinecone(filename);
      setSuccess(`Chunks for "${filename}" have been deleted successfully.`);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        File name:
        <input
          type="text"
          value={filename}
          onChange={handleChange}
          placeholder="Enter filename (e.g., example.pdf)"
        />
      </label>
      <button type="submit">Delete</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
}
