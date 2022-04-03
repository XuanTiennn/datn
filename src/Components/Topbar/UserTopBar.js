import { useHistory } from "react-router-dom";
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import keycloak from 'keycloak';
import { Context } from 'store/Store';
import ResetPassword from "../../../features/system/components/ResetPassword";
import UserApi from "../../../service/UserService";
import CommonFunction from 'lib/common';
import { OverlayPanel } from "primereact/overlaypanel";
import XAvatar from "components/x-avatar/XAvatar";

export const UserTopBar = (props) => {
    const { t } = useTranslation();
    const userMenu = useRef();
    const history = useHistory();
    const [state, dispatch] = useContext(Context);
    const [user, setUser] = useState({});
    const refUserMenu = useRef(null);

    const refResetPassword = useRef();

    useEffect(() => {
        if (state.user.id) {
            UserApi.getById(state.user.id).then(_user => {
                setUser(_user);
            });
        }
    }, [state.user]);

    if (state.user) {
        return (
            <>
                <div className="topbar-item topbar-user" onClick={(e) => refUserMenu.current.toggle(e)}>
                    <XAvatar
                        size="24px"
                        src={CommonFunction.getImageUrl(state.user.avatar, state.user.fullName)}
                        label={() => (<>
                            <span className="topbar-user-username">{state.user.fullName}</span>
                            <span className='bx bx-chevron-down fs-14 text-grey'></span>
                        </>)}
                    ></XAvatar>
                </div>

                <OverlayPanel ref={refUserMenu} className="x-menu">
                    <div className="x-menu-button" onClick={() => history.push("/user-profile")}>
                        <i className='bx bx-user'></i>
                        <span>{t('topbar.edit-profile')}</span>
                    </div>

                    <div className="x-menu-button" onClick={() => refResetPassword.current.resetPassword()}>
                        <i className='bx bx-lock'></i>
                        <span>{t('topbar.change-password')}</span>
                    </div>

                    <div className="x-menu-divider"></div>

                    <div className="x-menu-button" onClick={() => keycloak.logout()}>
                        <i className='bx bx-power-off text-red-9'></i>
                        <span>{t('topbar.log-out')}</span>
                    </div>
                </OverlayPanel>

                <ResetPassword ref={refResetPassword} user={user} />
            </>
        )
    } else {
        return <></>
    }
}
