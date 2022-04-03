import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from 'store/Store';
import CommonFunction from 'lib/common';
import { Sidebar } from 'primereact/sidebar';
import { XLayout, XLayout_Title, XLayout_Top, XLayout_Center, XLayout_Row } from "components/x-layout/XLayout";
import { Button } from "primereact/button";
import _ from "lodash";
import classNames from "classnames";
import { InputSwitch } from 'primereact/inputswitch';
import UserApi from "service/UserService";

export const UserSettings = (props) => {
    const { t } = useTranslation();
    const [state] = useContext(Context);
    const [showSettings, setShowSettings] = useState(false);
    const defaultSettings = {
        scale: 14,
        theme: "main-color-default",
        notificationSound: "correct-answer-tone"

    }
    const [settings, setSettings] = useState(defaultSettings);
    const refCurrentSettings = useRef(defaultSettings);

    useEffect(() => {
        if (state.user.id) {
            // default settings
            let _settings = (state.user.configs && state.user.configs.themes) ? state.user.configs.themes : {};
            _settings = { ...defaultSettings, ..._settings };
            setSettings(_settings);
            refCurrentSettings.current = _.cloneDeep(_settings);
            CommonFunction.applyUserSettingsToDOM(_settings);
            // apply user settings
        }
    }, [state.user]);

    /**
     * change setting
     * @param {*} setting
     * @param {*} value
     */
    const changeSetting = (setting, value) => {
        let _settings = _.cloneDeep(refCurrentSettings.current);
        let _change = {};
        switch (setting) {
            case "scale":
                _settings.scale += value;
                if (_settings.scale < 12) _settings.scale = 12;
                if (_settings.scale > 18) _settings.scale = 18;
                _change = { scale: _settings.scale };
                break;
            case "background":
                _change = { background: value };
                _settings.background = value;
                break;
            case "mainColor":
                _change = { mainColor: value };
                _settings.mainColor = value;
                break;
            case "darkMode":
                _change = { darkMode: value };
                _settings.darkMode = value;
                break;
            case "notificationSound":
                if (value !== "sound-silent") {
                    CommonFunction.playSound(`/assets/sound/notification/${value}.wav`);
                }
                _change = { notificationSound: value }
                _settings.notificationSound = value;
                break;
            default:
                break;
        }

        refCurrentSettings.current = _settings;
        setSettings(_.cloneDeep(_settings));
        UserApi.updateConfig({ themes: _settings });
        CommonFunction.applyUserSettingsToDOM(_change);
    }

    if (state.user) {
        return (
            <>
                <div className="topbar-item topbar-user-settings" onClick={(e) => setShowSettings(true)}>
                    <span className='bx bx-cog fs-20 text-grey-7'></span>
                </div>

                <Sidebar
                    className="sidebar-user-settings"
                    position="right"
                    showCloseIcon={false}
                    visible={showSettings}
                    onHide={() => setShowSettings(false)}
                    style={{ width: "350px" }}
                >
                    <XLayout>
                        <XLayout_Top center={1}>
                            <div className="sidebar-user-settings-header">
                                <XLayout_Title>
                                    {t("layout.user-setting.title")}
                                </XLayout_Title>
                                <Button
                                    className="p-button-rounded p-button-text"
                                    icon="bx bx-x text-red-9"
                                    onClick={() => setShowSettings(false)}
                                ></Button>
                            </div>
                        </XLayout_Top>
                        <XLayout_Center className="sidebar-user-settings-content">
                            {/* dark mode */}
                            {/* <XLayout_Title className="p-d-flex p-ai-center p-mb-0">
                                <span>{t("layout.user-setting.dark-mode")}</span>
                                <InputSwitch checked={settings.darkMode} className="p-ml-2" onChange={(e) => changeSetting("darkMode", e.value)} />
                            </XLayout_Title>
                            <div className="sidebar-user-settings-divider"></div> */}
                            {/* Scale */}
                            <XLayout_Title>
                                {t("layout.user-setting.scale")}
                            </XLayout_Title>
                            <div className="sidebar-user-settings-scale">
                                <span className="bx bx-minus link-button" onClick={() => changeSetting("scale", -1)}></span>
                                {[12, 13, 14, 15, 16, 17, 18].map((size, index) => (
                                    <span
                                        key={index}
                                        className={classNames({
                                            "bx bxs-circle app-scale-size-icon": true,
                                            "text-grey": settings.scale !== size,
                                            "app-scale-size-icon-active": settings.scale === size
                                        })}></span>
                                ))}
                                <span className="bx bx-plus link-button" onClick={() => changeSetting("scale", 1)}></span>
                            </div>
                            <hr />
                            {/* Main color */}
                            <XLayout_Title>
                                {t("layout.user-setting.main-color")}
                            </XLayout_Title>
                            <div className="sidebar-user-settings-main-color">
                                {[
                                    "main-color-default", "main-color-red", "main-color-pink", "main-color-purple", "main-color-indigo", "main-color-blue",
                                    "main-color-cyan", "main-color-teal", "main-color-green", "main-color-amber", "main-color-orange", "main-color-brown"
                                ].map((theme, index) => (
                                    <div key={index} className="main-color-item" onClick={() => changeSetting("mainColor", theme)}>
                                        <div className={classNames({
                                            "main-color-item-content": true,
                                            [theme]: true,
                                            "selected": settings.mainColor === theme
                                        })}></div>
                                    </div>
                                ))}
                            </div>
                            <hr />
                            {/* Background */}
                            <XLayout_Title>
                                {t("layout.user-setting.background")}
                            </XLayout_Title>
                            <div className="sidebar-user-settings-background">
                                {[
                                    "bg-1", "bg-2", "bg-3", "bg-4", "bg-5", "bg-6",
                                    "bg-color-1", "bg-color-2", "bg-color-3", "bg-color-4", "bg-color-5", "bg-color-6",
                                    "bg-gradient-1", "bg-gradient-2", "bg-gradient-3",
                                    "bg-none"
                                ].map((background, index) => (
                                    <div key={index} className="background-item" onClick={() => changeSetting("background", background)}>
                                        <div className={classNames({
                                            "background-item-content": true,
                                            [background]: true,
                                            "selected": settings.background === background
                                        })}></div>
                                    </div>
                                ))}
                            </div>
                            <hr />
                            {/* Background */}
                            <XLayout_Title>
                                {t("layout.user-setting.notification-sound")}
                            </XLayout_Title>
                            <div className="sidebar-user-settings-notification-sound">
                                {[
                                    { key: "sound-silent", name: t("notification.sound.silent") },
                                    { key: "bell", name: "Bell" },
                                    { key: "cooking-stopwatch", name: "Cooking Stopwatch" },
                                    { key: "correct-answer-tone", name: "Correct Answer" },
                                    { key: "doorbell-single-press", name: "Doorbell Single Press" },
                                    { key: "double-beep-tone", name: "Double Beep Tone" },
                                    { key: "guitar", name: "Guitar" },
                                    { key: "happy-bells", name: "Happy Bells" },
                                    { key: "interface-hint", name: "Interface Hint" },
                                    { key: "long-pop", name: "Long pop" },
                                    { key: "pop-up", name: "Pop up" },
                                    { key: "software-interface-start", name: "Software Interface Start" },
                                    { key: "uplifting-flute", name: "Uplifting Flute" }
                                ].map((sound, index) => (
                                    <div key={index} className="notification-sound-item" onClick={() => changeSetting("notificationSound", sound.key)}>
                                        <div className={classNames({
                                            "notification-sound-content": true,
                                            "selected": settings.notificationSound === sound.key
                                        })}>
                                            <span className={classNames({
                                                "bx sound-icon": true,
                                                "bx-bell-off": sound.key === "sound-silent",
                                                "bx-music": sound.key !== "sound-silent"
                                            })}></span>
                                            <span className="sound-name">{sound.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </XLayout_Center>
                    </XLayout>
                </Sidebar>

            </>
        )
    } else {
        return <></>
    }
}
