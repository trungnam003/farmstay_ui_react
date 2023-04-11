import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Progressbar({ value, minValue, maxValue, text, className, styles, ...props }) {
    return (
        <CircularProgressbar
            value={value}
            minValue={minValue || 0}
            maxValue={maxValue || 100}
            text={`${text}`}
            className={className}
            styles={buildStyles({
                ...styles,
            })}
            {...props}
        />
    );
}

export default Progressbar;
