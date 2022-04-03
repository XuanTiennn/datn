import { XLayout_Left } from 'components/x-layout/XLayout';
import _ from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from 'store/Store';
import { Dock } from 'primereact/dock';

/**
 * main menu
 */
function MainMenuDock(props) {
    const { menu } = props;
    const [preparedMenu, setPreparedMenu] = useState(null);
    const [state] = useContext(Context);
    const refMenuMode = useRef("mini");

    useEffect(() => {
        if (state.user && state.user.id && menu && !preparedMenu) {
            let _preparedMenu = { top: [], sub: {} };

            for (let i = 0; i < menu.length; i++) {
                menu[i].icon = menu[i].icon.replace("bx ", "")
                _preparedMenu.top.push({
                    template: () => (
                        <img src={`/assets/images/modules/${menu[i].icon}.png`}></img>
                    )
                })
            }
            setPreparedMenu(_preparedMenu)
        }
    }, [state.user])

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
        }

        for (let i = 0; i < _menu.length; i++) {
            prepareItem(_menu[i]);
        }

        return _menu;
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
            <XLayout_Left id="appMainMenu" style={{ width: "calc(1rem + 26px)" }}>
                <Dock className='main-menu-dock' model={preparedMenu.top} position="left" />
            </XLayout_Left>

        );
    } else {
        return <></>
    }


}

export default MainMenuDock
