import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', files: 30 },
  { name: 'Feb', files: 45 },
  { name: 'Mar', files: 28 },
  { name: 'Apr', files: 60 },
  { name: 'May', files: 50 },
  { name: 'Jun', files: 80 },
  { name: 'Jul', files: 65 },
];

export default function AreaChartFiling() {
  return (
    <div className="w-full h-65  p-1">
        <div className='flex justify-between mb-2'>
            <h2 className="text-[#535050] text-xs ">Monthly Patient files Updates</h2>
              <p className="text-gray-700 text-xs mb-2">
                Total Files: <span className="font-semibold text-black">500</span>
            </p>
        </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorFiles" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1FBEC3" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#1FBEC3" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="files"
            stroke="#1FBEC3"
            fillOpacity={1}
            fill="url(#colorFiles)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
