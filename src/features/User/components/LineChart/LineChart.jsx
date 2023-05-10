import moment from 'moment';
import 'moment/locale/vi';
import { useEffect, useState } from 'react';
import { LineChart as LineChartReChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function LineChart({ data, height, width, XAxisKey, YAxisKey, lineKey, danger = false }) {
    const [values, setValues] = useState(data);
    useEffect(() => {
        if (Array.isArray(data) && data.length > 0) {
            setValues(
                data.map((item) => {
                    const { timestamp } = item;
                    if (typeof timestamp === 'number') {
                        return Object.assign(item, { timestamp: moment(timestamp * 1000).format('lll:s') });
                    }
                    return item;
                }),
            );
        }
    }, [data]);
    return (
        <LineChartReChart
            width={500}
            height={222}
            data={values}
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
            <Tooltip cursor={{ strokeWidth: 1 }} />
            <Legend />

            <Line
                type="monotone"
                isAnimationActive={false}
                dataKey={lineKey}
                stroke={danger ? '#FF0000' : '#82ca9d'}
                strokeWidth={1.5}
            />
        </LineChartReChart>
    );
}

export default LineChart;
