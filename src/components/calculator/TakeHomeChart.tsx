import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TakeHomeChartProps {
  netDividend: number;
  tax: number;
}

const TakeHomeChart = ({ netDividend, tax }: TakeHomeChartProps) => {
  const data = [
    { name: 'Net Dividend', value: netDividend, color: 'hsl(var(--primary))' },
    { name: 'Tax', value: tax, color: 'hsl(var(--muted-foreground))' },
  ].filter(d => d.value > 0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 }).format(value);

  if (data.length === 0) return null;

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={55}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            iconType="circle"
            iconSize={8}
            formatter={(value, entry) => {
              const item = data.find(d => d.name === value);
              return (
                <span className="text-xs text-foreground">
                  {value}: {item ? formatCurrency(item.value) : ''}
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TakeHomeChart;