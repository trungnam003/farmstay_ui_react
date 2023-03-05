import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';

import styles from './SearchItem.module.scss';

const cx = classNames.bind(styles);

function SearchItem() {
    return (
        <div className={cx('wrapper')}>
            <img
                className={cx('avatar')}
                src="https://www.hoteljob.vn/files/Anh-HTJ-Hong/farmstay-la-gi-1.jpg"
                alt="Farmstay"
            />
            <div className={cx('info')}>
                <h4 className={cx('title')}>
                    <span>Farmstay Đà Lạt</span>
                    <FontAwesomeIcon className={cx('check')} icon={faCheckCircle} />
                </h4>
                <span className={cx('sub-title')}>2900000</span>
            </div>
        </div>
    );
}

export default SearchItem;
