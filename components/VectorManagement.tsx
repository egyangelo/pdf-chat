import { useState } from "react";
import { Button, Input } from "./ui";

export function VectorManagement() {
  const [filename, setFilename] = useState("");
  const [count, setCount] = useState<number | null>(null);

  const handleCount = async () => {
    const response = await fetch("/api/count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    const data = await response.json();
    setCount(data.count);
  };

  const handleDelete = async () => {
    await fetch("/api/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    setCount(null); // Reset count after deletion
  };

  return (
    <div>
      <Input
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        placeholder="Enter filename"
      />
      <Button onClick={handleCount}>Count Vectors</Button>
      <Button onClick={handleDelete}>Delete Vectors</Button>
      {count !== null && <p>Count: {count}</p>}
    </div>
  );
} 