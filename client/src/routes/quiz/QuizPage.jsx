import React, { useState } from "react";

const QuizPage = () => {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuizQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/quiz/generate?topic=${encodeURIComponent(
          topic
        )}&numQuestions=${numQuestions}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setQuizQuestions(data);
    } catch (err) {
      setError("Failed to generate quiz questions.");
      console.error("Fetch error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center h-full gap-8 lg:gap-24 text-white">
      <img
        src="/orbital.png"
        alt="Background"
        className="absolute left-0 bottom-0 opacity-5 -z-10"
      />
      <div className="flex flex-col items-center justify-center gap-6 text-center p-6">
        <h1 className="font-semibold text-4xl lg:text-7xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            QUIZ GENERATOR
          </span>
        </h1>
        <h2 className="text-lg lg:text-2xl text-gray-400">
          Create your own quiz based on any topic!
        </h2>
        <div className="mt-5 flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Enter quiz topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="px-4 py-2 rounded-md text-black"
          />
          <input
            type="number"
            placeholder="Number of questions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="px-4 py-2 rounded-md text-black"
            min="1"
            max="20"
          />
          <button
            onClick={fetchQuizQuestions}
            className="px-6 py-3 bg-white text-black rounded-md text-sm hover:bg-gray-200 active:bg-gray-300"
          >
            Generate Quiz
          </button>
        </div>
        {loading && <p className="mt-5 text-gray-400">Loading...</p>}
        {error && <p className="mt-5 text-red-500">{error}</p>}
        <div className="quiz mt-5">
          {quizQuestions.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              {quizQuestions.map((q, index) => (
                <div key={index} className="mb-4">
                  <p className="text-lg font-semibold text-gray-200">
                    Q{index + 1}: {q.question}
                  </p>
                  <p className="text-md text-gray-400">Answer: {q.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
