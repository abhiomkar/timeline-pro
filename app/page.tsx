"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatTimeline } from "./date";

interface Person {
  name: string;
  timeline?: string;
}

export default function Home() {
  const samplePersonList = [
    { name: "Elon Musk", timeline: "1971-06-28,0" },
    { name: "Steve Jobs", timeline: "1955-02-24,2011-10-05" },
    { name: "Stephen Hawking", timeline: "1942-01-08,2018-03-14" },
    { name: "Nelson Mandela", timeline: "1918-07-18,2013-12-05" },
    { name: "Mother Teresa", timeline: "1910-08-26,1997-09-05" },
    { name: "Rani Lakshmibai", timeline: "1828-11-19,1858-06-18" },
  ];
  const [personList, setPersonList] = useState<Person[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPersonList([{ name: inputValue, timeline: "" }, ...personList]);
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

    if (!response.error) {
      setCurrentPerson({ name: inputValue, timeline: response.text });
    }
  };

  const handleTryExample = () => {
    setPersonList(samplePersonList);
    setCurrentPerson(null);
  };

  const handleReset = () => {
    setPersonList([]);
  };

  useEffect(() => {
    setPersonList(
      personList
        .map((person) => {
          if (person.name === currentPerson?.name) {
            return { ...person, timeline: currentPerson?.timeline };
          }

          return person;
        })
        .sort((a: Person, b: Person) => {
          if (a.timeline && b.timeline) {
            return parseInt(b.timeline, 10) - parseInt(a.timeline, 10);
          }

          return 0;
        })
    );
  }, [currentPerson]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2 gap-4">
      <div className="z-10 w-full max-w-2xl text-sm flex flex-col">
        <h1 className="text-2xl font-bold pt-2 pb-3">Timeline Pro</h1>
        <form onSubmit={handleSubmit} className="flex gap-1">
          <Input
            placeholder="Person name"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button type="submit">Submit</Button>
        </form>
        <div className="flex justify-start">
          <Button variant="link" onClick={handleTryExample}>
            Try example
          </Button>
          <Button variant="link" onClick={handleReset}>
            Reset
          </Button>
        </div>
        <ul className="pt-8 pb-4 px-2">
          {personList.map((person, index) => (
            <li key={index} className="flex flex-col">
              {index === 0 ? null : (
                <div className="h-6 w-6 flex justify-center">
                  <div className="inline-flex w-0.5 h-full bg-gray-600"></div>
                </div>
              )}
              <div className="flex gap-2 items-center">
                <div className="h-6 w-6 flex-shrink-0 border-gray-600 border-2 rounded-full"></div>{" "}
                <strong>{person.name}</strong>{" "}
                {person.timeline ? formatTimeline(person.timeline) : null}
              </div>
              {index === personList.length - 1 ? null : (
                <div className="h-6 w-6 flex justify-center">
                  <div className="inline-flex w-0.5 h-full bg-gray-600"></div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex z-10 w-full max-w-2xl text-xs pb-4 flex-col justify-start items-start text-gray-600 gap-1">
        <div>The data might be inaccurate since it is based on an LLM.</div>
        <div>
          Powered by Vertex AI + Vercel. See{" "}
          <a
            className="text-primary underline-offset-4 hover:underline"
            href="https://github.com/abhiomkar/timeline-pro"
          >
            Source Code
          </a>
        </div>
      </div>
    </main>
  );
}
