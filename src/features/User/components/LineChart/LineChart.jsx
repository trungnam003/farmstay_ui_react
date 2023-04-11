import { LineChart as LineChartReChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function LineChart({ data, height, width, XAxisKey, YAxisKey, lineKey }) {
    return (
        <LineChartReChart
            width={500}
            height={222}
            data={data}
            margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={XAxisKey} hide />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line type="monotone" isAnimationActive={false} dataKey={lineKey} stroke="#82ca9d" />
        </LineChartReChart>
    );
}

export default LineChart;
