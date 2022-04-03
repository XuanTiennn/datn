import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Notice_Context } from 'store/notice/Notice_Store';
import CommonFunction from "lib/common";
import _ from 'lodash';
import Badges from 'components/badge/Badges';
import classNames from 'classnames';
import { OverlayPanel } from 'primereact/overlaypanel';
import { XLayout_Title } from 'components/x-layout/XLayout';
import { Button } from 'primereact/button';
import NotificationApi from 'service/NotificationService';

export const Notifications = (props) => {
    const [notice_state, notice_dispatch] = useContext(Notice_Context);

    const { t } = useTranslation();

    const [notifications, setNotifications] = useState([]);

    const [totalUnreadRecords, setTotalUnreadRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [lazy, setLazy] = useState({
        first: 0,
        rows: 10,
        page: 0,
        more: false
    });

    const refNotificationsPanel = useRef(null);
    const refIsLoadingNotification = useRef(false);

    useEffect(() => {
        loadLazyData();
    }, []);

    /**
     * when notification update
     */
    useEffect(() => {

        // re-render notification if notification panel opening
        if (notice_state.notifications.length > 0 && document.getElementById("notification_panel")) {
            prepareNotificationContent();
        }

        // increase notification badge number if ! load more
        if (notice_state.notifications.length > 0) {
            if (refIsLoadingNotification.current) {
                refIsLoadingNotification.current = false;
            } else {
                setTotalUnreadRecords(totalUnreadRecords + 1);
            }
        }

    }, [notice_state.notifications]);

    /**
     * get data
     */
    const loadLazyData = (_lazy) => {
        _lazy = _lazy ? _lazy : _.cloneDeep(lazy);

        setLoading(true);

        // mark is loading more
        refIsLoadingNotification.current = true;

        NotificationApi.get(_lazy).then(res => {
            if (res) {
                res.content.forEach(d => {
                    // d.content = Base64.decode(d.content);
                    d.createDate = new Date(d.createDate);
                });

                // prepare lazy
                _lazy.page = res.page;
                _lazy.more = (res.page + 1) * res.pageSize < res.total;
                setLazy(_lazy);

                // set total unread
                setTotalUnreadRecords(res.unread);

                // dispatch notification
                notice_dispatch({ type: 'ADD_OLD_NOTIFICATIONS', payload: res.content });
            }

            setLoading(false);
        });
    };

    /**
     * load more
     */
    const loadMore = () => {
        // change lazy config
        let _lazy = _.cloneDeep(lazy);
        _lazy.page += 1;

        // load more data
        loadLazyData(_lazy);
    }

    /**
     * mark all read of notifies
     */
    const markAllRead = () => {
        if (totalUnreadRecords > 0) {
            NotificationApi.markAllAsRead().then(res => {
                // change state
                let _notifications = _.cloneDeep(notice_state.notifications);
                _notifications.forEach(_notice => {
                    _notice.status = 1;
                });

                // dispatch store - after dispatch store, notifications will be re-render
                notice_dispatch({ type: "REPLACE_ALL_NOTIFICATIONS", payload: _notifications });

                // set unread all
                setTotalUnreadRecords(0);
            });
        }
    };

    /**
     * mark notice as read
     * @param {*} notification
     */
    const markRead = (status, id, index) => {
        if (status === 0) {
            NotificationApi.markAsRead(id).then(res => {
                // change state
                let _notifications = _.cloneDeep(notice_state.notifications);
                _notifications[index].status = 1;

                // dispatch store - after dispatch store, notifications will be re-render
                notice_dispatch({ type: "REPLACE_ALL_NOTIFICATIONS", payload: _notifications });

                // set unread
                setTotalUnreadRecords(totalUnreadRecords - 1);
            });
        }
    }

    /**
     * prepare notification content
     */
    const prepareNotificationContent = () => {
        let _notifications = [];
        notice_state.notifications.forEach(notice => {
            _notifications.push({
                id: notice.id,
                content: notice.content,
                createDate: notice.createDate,
                subject: notice.subject,
                sender: notice.sender,
                status: CommonFunction.isEmpty(notice.status) ? 0 : notice.status,
                ago: CommonFunction.getTimeAgo(notice.createDate)
            })
        });

        setNotifications(_notifications);
    }

    /**
     * on notification panel show
     */
    const showNotificationPanel = (e) => {

        prepareNotificationContent();

        setTimeout(() => {
            if (!document.getElementById("notification_panel")) {
                refNotificationsPanel.current.toggle(e);
            }
        }, 0);
    }

    return (<>
        <OverlayPanel ref={refNotificationsPanel} id="notification_panel" className="topbar-notification-panel">

            <div className="p-d-flex p-ai-center p-jc-between p-p-2-5 p-pb-1">
                <XLayout_Title>{t("common.notification")}</XLayout_Title>
                <Button
                    icon={`bx bx-check-double ${totalUnreadRecords > 0 ? "text-blue" : "text-grey"}`}
                    className="p-button-text p-button-rounded"
                    disabled={totalUnreadRecords === 0}
                    tooltip={t("notification.view-all")}
                    tooltipOptions={{ position: "bottom" }}
                    onClick={markAllRead}
                ></Button>
            </div>

            {notifications.map((notice, index) => (
                <div key={index}
                    className={classNames({ "notification-item": true, "pointer": notice.status === 0 })}
                    onClick={() => markRead(notice.status, notice.id, index)}
                >
                    {/* avatar */}
                    <div className={classNames({
                        "sender-avatar": true,
                        "system": notice.sender === "system"
                    })}>
                        {(!notice.sender || notice.sender === "system") &&
                            <img src="/assets/layout/images/logo-only.svg" ></img>}
                    </div>
                    {/* content */}
                    <div className="p-d-flex p-flex-column overflow-hidden">
                        <span className={classNames({
                            "bold-and-color": notice.status === 0,
                            "bold text-grey-7": notice.status !== 0
                        })}>{notice.subject}</span>
                        <span
                            className={classNames({
                                "text-grey-7 notification-content-text": true,
                                "bold": notice.status === 0
                            })}
                            dangerouslySetInnerHTML={{ __html: CommonFunction.htmlDecode(notice.content) }}
                        />
                        <div className={classNames({
                            "p-d-flex p-ai-center": true,
                            "text-primary": notice.status === 0,
                            "text-grey-7": notice.status !== 0
                        })}>
                            <span className='bx bx-time-five fs-14 p-mr-1'></span>
                            <span className="small">{notice.ago}</span>
                        </div>
                    </div>
                    {/* read */}
                    <div className="notification-item-unread p-d-flex p-ai-center p-jc-center">
                        {notice.status === 0 &&
                            <i
                                className='bx bxs-circle text-primary fs-10 link-button'
                                title={t("notification.mark-as-read")}
                            ></i>
                        }
                    </div>
                </div>
            ))}

            {/* load more */}
            {lazy.more &&
                <div
                    className="p-d-flex p-ai-center p-jc-center link-button text-primary p-pb-2 p-pt-2"
                    onClick={loadMore}
                >
                    <i className={classNames({
                        "bx fs-18 align-middle p-mr-2 bold": true,
                        "bx-loader bx-spin": loading,
                        "bx bx-chevron-down": !loading
                    })}></i>
                    <span>{t("common.load-more")}</span>
                </div>
            }

        </OverlayPanel>

        <div
            className={classNames({
                "topbar-item topbar-notification": true,
                "has-notify": totalUnreadRecords > 0
            })}
            onClick={(e) => showNotificationPanel(e)}>
            <i className={classNames({
                "bx bx-bell text-grey-7 fs-20": true,
                "bx-tada": totalUnreadRecords > 0
            })} />
            {totalUnreadRecords > 0 &&
                <Badges
                    className={classNames({
                        "topbar-notification-badge": true,
                        "circle": totalUnreadRecords < 10,
                        "fs-12": totalUnreadRecords < 100,
                        "fs-10": totalUnreadRecords > 99
                    })}
                    pill
                    severity="danger"
                >
                    {totalUnreadRecords}
                </Badges>
            }
        </div>
    </>);
}
