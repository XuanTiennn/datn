import React from 'react';
import { Notifications } from './Topbar/Notification';
import { UserTopBar } from './Topbar/UserTopBar';
import { Languages } from './Topbar/Languages';
import { SessionConfig } from './Topbar/SessionConfig';
import { XLayout, XLayout_Left, XLayout_Right } from 'components/x-layout/XLayout';
import { UserSettings } from './Topbar/UserSettings';
import { MessengerTopBar } from './Topbar/MessengerTopBar';

export const AppTopbar = (props) => {

    /**
     * toggle menu
     */
    const toggleMenu = () => {
        let mainMenu = document.getElementById("appMainMenu");
        if (mainMenu) {
            mainMenu.classList.toggle("mini-mode");

            // set style for hmtl
            let html = document.getElementsByTagName("html");
            if (html) {
                html[0].classList.toggle("menu-expanded")
            }
        }
    }

    return (
        <XLayout>
            <XLayout_Left center={1}>
                <div className="topbar-menu-toggle" onClick={toggleMenu}>
                    {/* <i className='bx bx-menu-alt-right link-button'></i> */}
                    <div className="movement-icon"></div>
                </div>
                <SessionConfig />
            </XLayout_Left>

            <XLayout_Right center={1}>
                {/* languages */}
                <Languages />
                {/* messenger */}
                <MessengerTopBar />
                {/* message */}
                {/*<Message />*/}
                {/* notification */}
                <Notifications />
                {/* User */}
                <UserTopBar />
                {/* User settings */}
                <UserSettings />
            </XLayout_Right>

        </XLayout>
    );
}
