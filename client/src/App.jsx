import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import EntryForm from "./components/EntryForm";
import MoodChart from "./components/MoodChart";
import EntryList from "./components/EntryList";
import "react-toastify/dist/ReactToastify.css";

// Configure Axios base URL
axios.defaults.baseURL = "http://localhost:5000";

function App() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/entries");
      setEntries(res.data);
    } catch (error) {
      toast.error("Failed to load entries. Is the server running?");
      console.error("Backend connection error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleNewEntry = (entry) => {
    setEntries(prev => [entry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">🧠 Mental Wellness Journal</h1>
          <p className="mt-2 text-gray-600">
            Track your emotions and gain insights into your mental well-being
          </p>
        </header>

        <EntryForm onAdd={handleNewEntry} />

        {isLoading ? (
          <div className="mt-8 text-center">
            <p>Loading your data...</p>
          </div>
        ) : (
          <>
            <MoodChart data={entries} />
            <EntryList entries={entries} />
          </>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default App;