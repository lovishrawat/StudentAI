import React, { useState } from 'react';

const QuizPage = () => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // Fetch quiz questions from the API
  const fetchQuizQuestions = async () => {
    try {
      const res = await fetch(`/api/quiz/generate?topic=${topic}&numQuestions=${numQuestions}`);
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error('Failed to fetch quiz questions:', error);
    }
  };

  // Submit answers for evaluation
  const submitAnswers = async () => {
    try {
      const results = await Promise.all(
        questions.map((q, index) =>
          fetch('/api/quiz/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question: q.question,
              userAnswer: answers[index] || '',
              correctAnswer: q.answer,
            }),
          })
        )
      );
      const evaluations = await Promise.all(results.map(res => res.json()));
      setResult(evaluations);
    } catch (error) {
      console.error('Failed to evaluate answers:', error);
    }
  };

  return (
    <div>
      <h1>Quiz Page</h1>
      <input
        type="text"
        value={topic}
        onChange={e => setTopic(e.target.value)}
        placeholder="Enter quiz topic"
      />
      <input
        type="number"
        value={numQuestions}
        onChange={e => setNumQuestions(e.target.value)}
        placeholder="Number of questions"
      />
      <button onClick={fetchQuizQuestions}>Start Quiz</button>

      {questions.length > 0 && (
        <div>
          {questions.map((q, index) => (
            <div key={index}>
              <p>{q.question}</p>
              <input
                type="text"
                onChange={e => setAnswers({ ...answers, [index]: e.target.value })}
                placeholder="Your answer"
              />
            </div>
          ))}
          <button onClick={submitAnswers}>Submit Answers</button>
        </div>
      )}

      {result && (
        <div>
          <h2>Results:</h2>
          {result.map((r, index) => (
            <p key={index}>
              {questions[index].question}: {r.correct ? 'Correct' : 'Incorrect'}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
