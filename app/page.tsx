"use client";

import { useState, useEffect } from "react";

interface Person {
  name: string;
  timeline?: string;
}

export default function Home() {
  const [personList, setPersonList] = useState<Person[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newPerson = { name: inputValue, timeline };
    setPersonList([...personList, newPerson]);
    setInputValue("");

    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personName: inputValue,
      }),
    }).then((res) => res.json());

    setCurrentPerson({ name: inputValue, timeline: response.text });
  };

  useEffect(() => {
    setPersonList(
      personList.map((person) => {
        if (person.name === currentPerson?.name) {
          return { ...person, timeline: currentPerson?.timeline };
        }

        return person;
      })
    );
  }, [currentPerson]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
        <ul>
          {personList.map((person, index) => (
            <li key={index}>
              <strong>{person.name}</strong> {person.timeline}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
