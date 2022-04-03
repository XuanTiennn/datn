import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { locale } from "primereact/api";
import UserApi from 'service/UserService';
import { Context } from 'store/Store';
import { OverlayPanel } from 'primereact/overlaypanel';

export const Languages = (props) => {
    const { i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const languageMenu = useRef(null);
    const [state, dispatch] = useContext(Context);
    const refLanguageMenu = useRef(null);
    const languages = [
        { name: 'Tiếng Việt', code: 'vi' },
        { name: 'English', code: 'en' }
    ];

    // default previous language
    useEffect(() => {
        if (state.user) {
            setSelectedLanguage(state.user.locale || "vi");
        } else {
            setSelectedLanguage(localStorage.getItem("I18N_LANGUAGE") || "vi");
        }
    }, [state.user]);

    // change language
    const onChangeLanguage = (lang) => {
        UserApi.updateLocale(lang);
        i18n.changeLanguage(lang);
        localStorage.setItem("I18N_LANGUAGE", lang);
        setSelectedLanguage(lang);
        locale(lang);
        refLanguageMenu.current.hide();
        document.location.reload();
    }

    return (<>
        <div className="topbar-item topbar-language" onClick={(e) => refLanguageMenu.current.toggle(e)}>
            <img
                src={`assets/images/flags/${selectedLanguage}.jpg`}
                alt={selectedLanguage}
            ></img>
        </div>

        <OverlayPanel ref={refLanguageMenu} className="x-menu">
            {languages.map((l, index) => (
                <div
                    key={index}
                    className="x-menu-button"
                    onClick={() => onChangeLanguage(l.code)}
                >
                    <img src={`assets/images/flags/${l.code}.jpg`} className="topbar-language-menu-image" alt={l.code}></img>
                    <span>{l.name}</span>
                </div>
            ))}
        </OverlayPanel>
    </>)
}
