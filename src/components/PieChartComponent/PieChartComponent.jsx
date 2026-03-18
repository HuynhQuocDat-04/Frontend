import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { convertDataChart } from '../../utils';

const PAYMENT_METHOD_COLORS = {
  'Tiền mặt': '#00C49F',
  'QR Chuyển khoản': '#0088FE',
}

const FALLBACK_COLORS = ['#FFBB28', '#FF8042', '#A78BFA', '#F87171']

const PieChartComponent = (props) => {
  // Chuyển đổi dữ liệu đơn hàng sang dạng biểu đồ dựa trên phương thức thanh toán
  const data = convertDataChart(props.data, 'paymentMethod') 

  const getColorByEntry = (entry, index) => {
    const fixedColor = PAYMENT_METHOD_COLORS[entry?.name]
    if (fixedColor) return fixedColor
    return FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColorByEntry(entry, index)} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
  )
}

export default PieChartComponent