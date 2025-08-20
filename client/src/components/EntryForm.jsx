import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EntryForm({ onAdd }) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error("Please enter some text");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post("/analyze", { text });
      onAdd({ 
        text, 
        emotion: res.data.emotion,
        confidence: res.data.confidence,
        date: res.data.timestamp
      });
      setText("");
      toast.success(`Detected emotion: ${res.data.emotion}`);
    } catch (error) {
      toast.error("Error analyzing your entry. Check server connection.");
      console.error("API Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="How are you feeling today? Write your thoughts here..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={5}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-3 px-6 py-2 rounded-lg text-white font-medium ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? 'Analyzing...' : 'Analyze Mood'}
        </button>
      </form>
    </div>
  );
}