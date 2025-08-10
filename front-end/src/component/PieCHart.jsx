import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#1FBEC3', '#FF9F40']; // Teal for female, orange for male

export default function PieChartGender({ data = [] }) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col  w-full sm:w-1/2 mt-10 sm:mt-0 h-70 sm:h-65 px-2">
      <div className='flex justify-between'>
        <h2 className="text-[#535050] text-xs mb-0">Monthly Gender Updates</h2>
        <p className="text-gray-700 text-xs mb-2">
          Total Patients: <span className="font-semibold text-black">{total}</span>
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
