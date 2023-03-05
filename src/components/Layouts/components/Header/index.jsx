import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react/headless'; // different import path!
import { useEffect, useState } from 'react';

import styles from './Header.module.scss';
import images from '~/assets/images';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import SearchItem from '~/components/SearchItem';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Header() {
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setSearchResult([1]);
        }, 0);
    }, []);

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={'/'}>
                    <div className={cx('logo')}>
                        <svg width="54" height="54">
                            <image href={images.logo} width="54" height="54" />
                        </svg>
                    </div>
                </Link>
                <Tippy
                    visible={searchResult.length > 0}
                    interactive
                    render={(attrs) => {
                        return (
                            <div className={cx('search-result')} tabIndex="-1">
                                <PopperWrapper>
                                    <h4 className={cx('search-title')}>Farmstays</h4>
                                    <SearchItem></SearchItem>
                                    <SearchItem></SearchItem>
                                    <SearchItem></SearchItem>
                                </PopperWrapper>
                            </div>
                        );
                    }}
                >
                    <div className={cx('search')}>
                        <input type="text" placeholder="Tìm kiếm Farmstay" spellCheck={false} />
                        <button className={cx('clear')}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                        <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />

                        <button className={cx('search-btn')}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                    </div>
                </Tippy>

                <div className={cx('action')}>
                    <Button outline>Đăng Nhập</Button>
                    <Button primary>Đăng Ký</Button>
                </div>
            </div>
        </header>
    );
}

export default Header;
