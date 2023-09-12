import classNames from 'classnames';
import { PropsWithChildren, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './app.module.scss';
type MenuType = { chat?: boolean } & PropsWithChildren;
export default function Menu({ children, chat = false }: MenuType) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div
      className={classNames(styles['hamburger-menu'], {
        [styles['open']]: menuOpen,
      })}
    >
      <div className="w-full bg-dark-600 rounded-bl-xl">
        <div
          className={classNames(
            'w-24 h-16 relative ml-0 mr-auto',
            styles['hamburger']
          )}
          onClick={toggleMenu}
        >
          <button onClick={toggleMenu} className="menu">
            <div
              className={classNames(styles['hambergerIcon'], {
                [styles['open-ham']]: menuOpen,
              })}
            ></div>
          </button>
        </div>
      </div>
      <div className={classNames('bg-dark-600 h-full', styles['menu-content'])}>
        <ul>
          <li>
            {!chat && (
              <button
                className=" w-full hover:bg-dark-400 hover:bg-opacity-75 py-6 text-[#fff]"
                onClick={() => {
                  navigate('/message');
                }}
              >
                صفحه زمانبندی
              </button>
            )}
            {chat && (
              <button
                className=" w-full hover:bg-dark-400 hover:bg-opacity-75 py-6 text-[#fff]"
                onClick={() => {
                  navigate('/');
                }}
              >
                صفحه کنترل
              </button>
            )}
          </li>
          <li>{children}</li>
        </ul>
      </div>
    </div>
  );
  // const navigate = useNavigate();
  // const [openMenu, setOpenMenu] = useState(false);
  // return (
  //   <div className="fixed left-0 top-0 min-w-fit transition-all bg-dark-200">
  // <div className="w-24 h-16 relative mx-auto">
  //   <button
  //     onClick={() => {
  //       setOpenMenu(!openMenu);
  //     }}
  //     className="menu"
  //   >
  //     <div
  //       className={classNames(styles['hambergerIcon'], {
  //         [styles['open']]: openMenu,
  //       })}
  //     ></div>
  //   </button>
  // </div>
  //     {openMenu && (
  //       <div>
  // <button
  //   className=" bg-gray-800 py-3 px-10 rounded-br-xl text-[#fff]"
  //   onClick={() => {
  //     navigate('/message');
  //   }}
  // >
  //   صفحه زمانبندی
  // </button>
  //       </div>
  //     )}
  //   </div>
  // );
}
