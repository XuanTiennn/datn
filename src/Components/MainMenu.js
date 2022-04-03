// import { XLayout_Left } from './x-layout/XLayout';
// import _ from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { XLayout_Left } from './x-layout/XLayout';
// import { Context } from 'store/Store';
// import { useTranslation } from 'react-i18next';


/**
 * main menu
 */
function MainMenu(props) {
    const { menu } = props;
    // const { t } = useTranslation();
    const [preparedMenu, setPreparedMenu] = useState([]);
    const refCacheMenu = useRef(null);
    // const [state] = useContext(Context);
    const refMenuMode = useRef("mini");

    // useEffect(() => {
    //     if (state.user && state.user.id && menu) {
    //         // prepare menu, remove menu without permission
    //         refCacheMenu.current = JSON.stringify(menu);
    //         let _menu = prepareMenu(_.cloneDeep(menu));
    //         setPreparedMenu(_menu);
    //     }
    // }, [state.user])

    /**
     * prepare menu
     * @param {*} _item
     */
    const prepareMenu = (_menu) => {
        const prepareItem = (_item) => {

            _item.renderId = `main_menu_${_item.code.replaceAll("-", "_")}`

            if (_item.items && _item.items.length > 0) {
                // group menu
                for (let i = 0; i < _item.items.length; i++) {
                    prepareItem(_item.items[i]);
                }
            }
            // } else {
            //     // item menu
            //     _item.to = `#/${_item.to}`.replace("//", "/");
            // }
        }

        for (let i = 0; i < _menu.length; i++) {
            prepareItem(_menu[i]);
        }

        return _menu;
    }

    /**
     * toggle menu
     */
    const toggleMenu = () => {
        let mainMenu = document.getElementById("appMainMenu");
        if (mainMenu) {
            mainMenu.classList.toggle("mini-mode");
            refMenuMode.current = mainMenu.classList.contains("mini-mode") ? "mini" : "normal";

            // set style for hmtl
            let html = document.getElementsByTagName("html");
            if (html) {
                html[0].classList.toggle("menu-expanded")
            }
        }
    }

    /**
     * toggle menu item expand collapse
     */
    const toggleExpandCollapseMenuItem = (id) => {
        let mainMenu = document.getElementById("appMainMenu");
        if (mainMenu && !mainMenu.classList.contains("mini-mode")) {
            let item = document.getElementById(id);
            if (item) {
                item.classList.toggle("show-menu");
            }
        }
    }

    /**
     * render menu
     */
    const renderMenu = () => {
        const renderItem = (item, level) => {
            if (item.items && item.items.length > 0) {
                return (
                    <li>
                        <div className="parent-menu" id={item.renderId} onClick={() => toggleExpandCollapseMenuItem(item.renderId)}>
                            <div className="menu-icon-label">
                                <i className={item.icon || "bx bxs-circle"}></i>
                                <span className="menu-lable">{item.label}</span>
                            </div>
                            <i className='bx bx-chevron-down arrow'></i>
                        </div>
                        <ul className="sub-menu">
                            <li><div className="group-menu-label">{item.label}</div></li>
                            {item.items.map((subItem, subItemIndex) => (
                                <React.Fragment key={subItemIndex}>{renderItem(subItem, level + 1)}</React.Fragment>
                            ))}
                        </ul>
                    </li>
                )
            } else {
                return (
                    <li>
                        <a href={item.to} id={item.renderId} className="menu-icon-label">
                            <i className={item.icon || "bx bxs-circle"}></i>
                            <span className="menu-lable">{item.label}</span>
                        </a>
                        {level === 0 &&
                            <ul className="sub-menu blank">
                                <li><a className="single-menu-label" href={item.to}>{item.label}</a></li>
                            </ul>
                        }
                    </li>
                )
            }
        }

        return (<>
            {
                preparedMenu.map((item, index) => (<React.Fragment key={index}>{renderItem(item, 0)}</React.Fragment>))
            }
        </>)

    }

    // render
    if (preparedMenu) {
        return (
            <XLayout_Left id="appMainMenu" className="main-menu mini-mode" style={{ zIndex: 9 }}>
                <div className="main-menu-wrapper">
                    <ul className="nav-links">
                        {renderMenu()}
                    </ul>
                    <div className="toogle-menu menu-icon-label" onClick={() => toggleMenu()}>
                        <i className='bx bx-chevrons-right arrow-toggle'></i>
                        <span className="menu-lable">{("menu.collapse")}</span>
                    </div>
                </div> 
            </XLayout_Left>

        );
    } else {
        return <></>
    }


}

export default MainMenu
