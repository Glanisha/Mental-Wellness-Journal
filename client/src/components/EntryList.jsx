import { format } from 'date-fns';

const emotionColors = {
  sadness: 'bg-blue-100 text-blue-800',
  joy: 'bg-yellow-100 text-yellow-800',
  love: 'bg-pink-100 text-pink-800',
  anger: 'bg-red-100 text-red-800',
  fear: 'bg-purple-100 text-purple-800',
  surprise: 'bg-green-100 text-green-800',
};

export default function EntryList({ entries }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Your Recent Entries</h2>
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${emotionColors[entry.emotion] || 'bg-gray-100'}`}>
                {entry.emotion} ({(entry.confidence * 100).toFixed(1)}%)
              </span>
              <span className="text-xs text-gray-500">
                {format(new Date(entry.date), 'MMM dd, yyyy - h:mm a')}
              </span>
            </div>
            <p className="mt-2 text-gray-800">{entry.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}