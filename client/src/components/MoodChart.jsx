import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { format } from 'date-fns';

const emotionToScore = {
  sadness: 1,
  fear: 2,
  anger: 3,
  surprise: 4,
  joy: 5,
  love: 6,
};

export default function MoodChart({ data }) {
  // Process data for chart
  const chartData = data.map((entry) => ({
    date: format(new Date(entry.date), 'MMM dd'),
    score: emotionToScore[entry.emotion] || 3,
    emotion: entry.emotion,
    text: entry.text,
  }));

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Mood Over Time</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" />
            <YAxis 
              domain={[0, 6]} 
              tickCount={7}
              tickFormatter={(value) => {
                const emotion = Object.keys(emotionToScore).find(
                  key => emotionToScore[key] === value
                );
                return emotion || '';
              }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                      <p className="font-semibold">{data.date}</p>
                      <p>Mood: <span className="capitalize">{data.emotion}</span></p>
                      <p className="text-sm text-gray-600 mt-1">
                        {data.text.length > 50 
                          ? `${data.text.substring(0, 50)}...` 
                          : data.text}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#4f46e5" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}