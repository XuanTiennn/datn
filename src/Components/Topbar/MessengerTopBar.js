import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Context } from "store/Store";
import { Messenger_Context } from "store/messenger/Messenger_Store";
import CommonFunction from "lib/common";
import _ from 'lodash';
import Badges from 'components/badge/Badges';
import classNames from 'classnames';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';
import { XLayout_Box, XLayout_Title } from 'components/x-layout/XLayout';
import { useHistory, useLocation } from "react-router-dom";
import XAvatar from 'components/x-avatar/XAvatar';
import UserApi from "../../../service/UserService";
import MessengerApi from 'service/MessengerService';
import { UserInfo } from 'components/user-info/UserInfo';
import XCommentFunction from 'components/x-comments/XCommentFunction';
import { InputText } from 'primereact/inputtext';
import Messenger_Create from 'features/messenger/components/Messenger_Create';
import Messenger_Conversation from 'features/messenger/components/Messenger_Conversation';
import cache from 'lib/cache';
import { Dialog } from 'primereact/dialog';
import Messenger from 'features/messenger/MessengerNew';
import eventBus from "lib/eventBus";

export const MessengerTopBar = (props) => {
    const [state,] = useContext(Context);
    const [messenger_state] = useContext(Messenger_Context);
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const refMessengerPanel = useRef(null);
    const refOpenFullScreen = useRef(null);
    const defaultConversations = {
        data: [],
        page: -1,
        size: 20,
        total: 0
    }
    const [conversations, setConversations] = useState(defaultConversations);
    const [floatConversations, setFloatConversations] = useState([]);
    const refFloating = useRef();
    const refCreateChatMenu = useRef(null);
    const refMessengerCreateDialog = useRef(null);
    const refFloatConversations = useRef([]);
    const [unread, setUnread] = useState(0);
    const [filterConversationKeyword, setFilterConversationKeyword] = useState("");
    const defaultFilteredPeople = { page: 0, data: [], more: false };
    const [filteredPeople, setFilteredPeople] = useState(defaultFilteredPeople);
    const refUnread = useRef(0);
    const refConversationsInfo = useRef({});
    const [showMessengerDialog, setShowMessengerDialog] = useState(false);
    const refIgnoreClickEvent = useRef(false);

    useEffect(() => {
        // get unread message and un-notice conversations
        setTimeout(() => {
            getUnreadMessage();
        }, 1000); // delay 2s for business requests

        eventBus.on("userInfo-startChat", handleUserInfoStartChat);

        return () => {
            eventBus.remove("userInfo-startChat", handleUserInfoStartChat);
        }
    }, [])

    useEffect(() => {
        setTitleUnreadCount();
    }, [location]);

    /**
     * on event bus user info start chat
     * @param {*} _user
     */
    const handleUserInfoStartChat = (_user) => {
        onStartPaticipantChat(_user);
    }

    /**
     * get unread message
     */
    const getUnreadMessage = () => {
        MessengerApi.getUnreadMessage().then(res => {
            if (res) {

                if (res.total) {
                    document.title = `(${res.total}) ${document.title}`;
                }

                setUnread(res.total || 0);
                refUnread.current = res.total || 0;
                setTitleUnreadCount();
                let _blockNotice = {};
                if (res.blockNotice) {
                    res.blockNotice.forEach(convId => {
                        _blockNotice[convId] = 1;
                    });
                }
                window.ngdox_messenger_blockNotice = _blockNotice;
            }
        })
    }

    // notify message
    useEffect(() => {
        let _message = messenger_state.messenger_lastMessage;
        if (_message && _message.convId && (!_message.cmd || _message.cmd === "chat")) {

            // notify
            // ------------------------
            if (
                window.ngdox_messenger_blockNotice && !window.ngdox_messenger_blockNotice[_message.convId] // check if conv notice is blocked
                && _message.createBy !== state.user.id // check if message is not from current user
                && window.ngdox_messenger_activeConversation !== _message.convId // check if conv is active or not
            ) {
                let displayMsg = "";
                if (_message.type === "FILE" || _message.type === "MEDIA") {
                    displayMsg = t("task.attachment.file");
                } else {
                    displayMsg = XCommentFunction.getMessagePlainText(_message.content);
                }

                if (displayMsg.length > 100) displayMsg = displayMsg.substr(0, 97) + "...";

                if (refConversationsInfo.current[_message.convId]) {
                    if (document.visibilityState === "visible") {
                        CommonFunction.notifyInfo(displayMsg, refConversationsInfo.current[_message.convId].name, _message.convId, () => {
                            openFloatConversation({ id: _message.convId, name: refConversationsInfo.current[_message.convId].name });
                        });
                    }
                    if (window.plugon_settings_notificationSound) {
                        CommonFunction.playSound(window.plugon_settings_notificationSound);
                    }

                } else {
                    MessengerApi.getConversationById(_message.convId).then(res => {
                        if (res) {
                            refConversationsInfo.current[_message.convId] = {
                                name: res.name
                            }

                            if (document.visibilityState === "visible") {
                                CommonFunction.notifyInfo(displayMsg, res.name, _message.convId, () => {
                                    openFloatConversation({ id: _message.convId, name: res.name });
                                });
                            }
                            if (window.plugon_settings_notificationSound) {
                                CommonFunction.playSound(window.plugon_settings_notificationSound);
                            }
                        }
                    })
                }
            }

            // calculate unread
            // ------------------------
            if (window.ngdox_messenger_activeConversation !== _message.convId) {
                refUnread.current += 1;
                let current = refUnread.current;
                setTimeout(() => {
                    if (current === refUnread.current) {
                        setUnread(refUnread.current)
                        setTitleUnreadCount();
                    }
                }, 200);
            }
        }
    }, [messenger_state.messenger_lastMessage])

    /**
     * set unread count for title
     */
    const setTitleUnreadCount = () => {
        try {
            let title = document.title.replace(/\([0-9]*\) /g, "");
            let hasUnread = false;
            if (!CommonFunction.isEmpty(refUnread.current) && typeof refUnread.current === "number" && refUnread.current > 0) {
                hasUnread = true;
            }
            document.title = hasUnread ? `(${refUnread.current}) ${title}` : title;
        } catch (error) {
            console.log("MessengerTopBar setTitleUnreadCount", error);
        }
    }

    /**
     * reset unread message
     */
    useEffect(() => {

        if (messenger_state.messenger_readMessage && typeof messenger_state.messenger_readMessage.change === "number") {
            let newUnread = unread + messenger_state.messenger_readMessage.change;
            setUnread(newUnread);
            refUnread.current = newUnread;
            setTitleUnreadCount();
        }
    }, [messenger_state.messenger_readMessage])

    /**
     * check document visibility change
     */
    useLayoutEffect(() => {
        document.addEventListener("visibilitychange", onVisibilityChange);
        window.addEventListener('click', onWindowClick);

        return () => {
            document.removeEventListener("visibilitychange", onVisibilityChange);
            window.removeEventListener('click', onWindowClick);
        };
    }, []);

    /**
     * on document visibility change
     */
    const onVisibilityChange = () => {
        if (document.visibilityState === "visible") {
            getUnreadMessage();
        }
    };

    /**
     * on window click
     */
    const onWindowClick = (e) => {
        if (refIgnoreClickEvent.current) {
            refIgnoreClickEvent.current = false;
        } else {
            if (window.ngdox_messenger_activeConversation) {
                let allOpenedConversationElement = document.getElementsByClassName("messenger-conversation");
                let hasActive = false;

                if (allOpenedConversationElement && allOpenedConversationElement.length) {
                    for (let i = 0; i < allOpenedConversationElement.length; i++) {
                        const el = allOpenedConversationElement[i];
                        if (el.contains(e.target)) {
                            hasActive = true;
                        }
                    }

                    if (!hasActive) {
                        // if not click on any conversation, deactive current conversation
                        deactiveConversation(window.ngdox_messenger_activeConversation);
                        window.ngdox_messenger_activeConversation = null;
                    }
                }
            }
        }
    }

    /**
     * load conversation
     * @param {*} _page
     */
    const loadConversations = (_page, callback, filter) => {
        const params = {
            size: conversations.size,
            page: _page !== null ? _page : conversations.page + 1,
            filter: filter || null
        };

        MessengerApi.getConversation(params).then(async (res) => {
            let _conversations = _.cloneDeep(conversations);
            if (res && res.content && res.content.length > 0) {
                let _loaded = await prepareConversation(res.content);
                if (_page === 0) {
                    _conversations.data = _loaded;
                } else {
                    _conversations.data = _conversations.data.concat(_loaded);
                }
                _conversations.page = res.page;
                _conversations.total = res.total;
                _conversations.more = res.total < _conversations.data.length;
                _conversations.data = _.orderBy(_conversations.data, ["modifiedDate"], ["desc"]);

                setConversations(_conversations);
            } else {
                if (_page === 0) {
                    setConversations(_.cloneDeep(defaultConversations));
                }
            }

            if (callback && typeof callback === "function") {
                callback(_conversations);
            }
        });
    }

    /**
     * prepare conversation
     * @param {*} _conversations
     * @returns
     */
    const prepareConversation = async (_conversations) => {
        let prepared = [], userIds = [], today = (new Date()).setHours(0, 0, 0, 0);

        for (let i = 0; i < _conversations.length; i++) {
            const _conversation = _conversations[i];
            try {
                let _item = _.cloneDeep(_conversation);
                _item.modifiedDate = new Date(_item.modifiedDate);
                _item.private = _conversation.type === "PRIVATE";
                _item.msgTime = XCommentFunction.sayMessageTime(_item.modifiedDate);
                _item.msgDate = _item.modifiedDate > today ? t("toDay") : CommonFunction.getTimeAgo(_item.modifiedDate, true);
                _item.config = _item.config && typeof _item.config === "string" ? JSON.parse(_item.config) : {};

                if (_item.msgType === "FORWARD") {
                    let forwardContent = _item.msgContent;
                    if (typeof forwardContent === "string") {
                        forwardContent = JSON.parse(_item.msgContent);
                    }
                    _item.msgType = forwardContent.type;
                    _item.msgContent = forwardContent.content;
                }

                switch (_item.msgType) {
                    case "FILE":
                    case "MEDIA":
                        let _files = { image: 0, doc: 0, other: 0 }
                        if (typeof _item.msgContent === "string") {
                            _item.msgContent = JSON.parse(_item.msgContent);
                        }
                        _item.msgContent.forEach(f => {
                            let fileType = CommonFunction.getFileType(f.name)
                            switch (fileType) {
                                case "image":
                                    _files.image += 1;
                                    break;
                                case "word":
                                case "excel":
                                case "powerpoint":
                                case "pdf":
                                    _files.doc += 1;
                                    break;
                                default:
                                    _files.other += 1;
                                    break;
                            }
                        });
                        _item.files = _files;
                        break;
                    case "EVENT":
                        try {
                            if (!_item.contentParse) _item.contentParse = JSON.parse(_item.msgContent);
                            switch (_item.contentParse.type) {
                                case "create":
                                    _item.msgContent = t("messenger.list.event.create");
                                    break;
                                default:
                                    _item.msgContent = _item.contentParse.type;
                                    break;
                            }
                        } catch (error) {
                            console.log("prepare event message for conversation error", conversations, error);
                        }
                        break;
                    default:
                        _item.msgContent = XCommentFunction.getMessagePlainText(_item.msgContent);
                        break;
                }

                // prepare curent state
                if (_item.current) {
                    _item.unread = _item.current.unread || null;
                }

                prepared.push(_item);

                // check if user in cache
                if (_item.private) {
                    let _user = await cache.user.get(_item.partner);
                    if (!_user) {
                        userIds.push(_item.partner);
                    }
                }
            } catch (error) {
                console.log("prepare topbar conversation error", conversations, error);
            }
        }

        // order by modified date
        prepared = _.orderBy(prepared, ["modifiedDate"], ["desc"]);

        // recalculate some props, like date group
        for (let j = 0; j < prepared.length; j++) {
            prepared[j].showDateGroup = false;
            if (j === 0 || prepared[j].msgDate !== prepared[j - 1].msgDate) {
                prepared[j].showDateGroup = true;
            }
        }

        // get user and add to cache
        if (userIds.length > 0) {
            let _users = UserApi.getUserInfo(userIds);
            if (_users) {
                await cache.user.create(_users);
            }
        }

        return prepared;
    }

    /**
     * on notification panel show
     */
    const show = (e) => {
        setFilterConversationKeyword("");
        setFilteredPeople(defaultFilteredPeople);
        if (refMessengerPanel.current && refMessengerPanel.current.state && !refMessengerPanel.current.state.visible) {
            loadConversations(0, (_conversations) => {
                refMessengerPanel.current.show(e);
            })
        }
    }

    /**
     * render message content
     */
    const renderMessageContent = (_conversation) => {
        switch (_conversation.msgType) {
            case "FILE":
            case "MEDIA":
                return (<div className="message-content-files">
                    {_conversation.files && _conversation.files.image > 0 && <><span className='bx bx-image'></span><span className="p-mx-1">{t("messenger.file-type.image")}</span></>}
                    {_conversation.files && _conversation.files.doc > 0 && <><span className='bx bx-image'></span><span className="p-mx-1">{t("messenger.file-type.doc")}</span></>}
                    {_conversation.files && _conversation.files.other > 0 && <><span className='bx bx-image'></span><span className="p-mx-1">{t("messenger.file-type.other")}</span></>}
                </div>)
                break;

            default:
                let msg = XCommentFunction.getMessagePlainText(_conversation.msgContent);
                return (<div className="message-content-text">{msg}</div>)
                break;
        }
    }

    /**
     * load more
     */
    const loadMore = () => {
        loadConversations();
    }

    /**
     * create new message
     */
    const createChat = () => {
        refCreateChatMenu.current.hide();
        refMessengerCreateDialog.current.createPrivate();
    }

    /**
    * create new message
    */
    const createGroup = () => {
        refCreateChatMenu.current.hide();
        refMessengerCreateDialog.current.createGroup();
    }

    /**
     * on conversation filtering
     * @param {*} val
     */
    const filterConversation = (val) => {
        setFilterConversationKeyword(val);
        if (!CommonFunction.isEmpty(val)) {
            loadConversations(0, null, val);
            filterPeople(val);
        } else {
            loadConversations(0);
            setFilteredPeople(defaultFilteredPeople);
        }
    }

    /**
     * filter people
     * @param {*} keyword
     */
    const filterPeople = (keyword, page) => {
        UserApi.search({
            filter: keyword ? keyword.toLowerCase().trim() : filterConversationKeyword.toLowerCase().trim(),
            page: page || 0,
            size: 20,
        }).then(res => {
            if (res) {
                let _filteredPeople = _.cloneDeep(filteredPeople);
                if (res.page === 0) {
                    _filteredPeople.data = [];
                }
                _filteredPeople.data = _filteredPeople.data.concat(res.content);
                _filteredPeople.more = _filteredPeople.data.length < res.total;
                _filteredPeople.page = res.page;

                setFilteredPeople(_filteredPeople);
            }
        });
    }

    /**
     * start chat with group paticipant
     * @param {*} participant
     */
    const onStartPaticipantChat = (_participant) => {
        MessengerApi.getOrCreatePrivateConversation(
            state.user.id,
            state.user.fullName,
            _participant.id,
            _participant.name || _participant.fullName
        ).then(async res => {
            if (res) {
                prepareConversation([res]).then(prepared => {
                    openFloatConversation(prepared[0]);
                });
            }
        })
    }

    /**
     * after conversation created
     * @param {*} _conversation
     */
    const afterConversationCreated = (_conversation) => {
        openFloatConversation(_conversation);
    }

    /**
     * open float conversation
     */
    const openFloatConversation = (_conversation) => {
        let _floatConversations = _.cloneDeep(floatConversations);
        if (_floatConversations && _floatConversations.length === 0 && refFloating.current && refFloating.current.length > 0) {
            _floatConversations = _.cloneDeep(refFloating.current);
        }
        let found = _floatConversations.find(f => f.id === _conversation.id);
        let reApply = false;

        if (found) {
            if (!found.float) {
                // move to last
                _floatConversations = _.cloneDeep(_floatConversations.filter(f => f.id !== found.id));
                _floatConversations.push(found);
                reApply = true;
            }
        } else {
            // not in list
            _floatConversations.push(_conversation);
            reApply = true;
        }

        if (reApply) {
            let _floatArray = _.cloneDeep(refFloatConversations.current);
            // apply max 2 float conversation
            _floatArray.push(_conversation.id);
            if (_floatArray.length > 2) {
                _floatArray.shift();
            }

            refFloatConversations.current = _floatArray;

            //re apply float state
            _floatConversations.forEach(el => {
                el.float = _floatArray.indexOf(el.id) > -1;
            });

            refFloating.current = _floatConversations;
            setFloatConversations(_floatConversations);
        }
        refIgnoreClickEvent.current = true;
        activeConversation(_conversation.id);

        refMessengerPanel.current.hide();
    }

    /**
     * after leave conversation
     */
    const afterLeaveConversation = () => {

    }

    /**
     * minimize float
     */
    const onFloatConversationMinimize = (_conversation) => {
        let _floatConversations = _.cloneDeep(floatConversations);
        for (let i = 0; i < _floatConversations.length; i++) {
            if (_floatConversations[i].id === _conversation.id) {
                _floatConversations[i].float = false;
                refFloatConversations.current = refFloatConversations.current.filter(f => f !== _conversation.id);
                break;
            }
        }
        deactiveConversation(_conversation.id);
        refFloating.current = _floatConversations;
        setFloatConversations(_floatConversations);
    }

    /**
     * close float
     */
    const onFloatConversationClose = (_conversation) => {
        let _filter = floatConversations.filter(f => f.id !== _conversation.id);
        refFloating.current = _filter;
        setFloatConversations(_filter);
        window.ngdox_messenger_activeConversation = null;
    }

    /**
     * close all conversation
     */
    const closeAllFloatConversation = () => {
        refFloating.current = [];
        setFloatConversations([]);
        window.ngdox_messenger_activeConversation = null;
    }

    /**
     * minimize all float conversation
     */
    const minimizeAllFloatConversation = () => {
        let _floatConversations = _.cloneDeep(floatConversations);
        for (let i = 0; i < _floatConversations.length; i++) {
            _floatConversations[i].float = false;
            deactiveConversation(_floatConversations[i].id);
        }
        refFloating.current = _floatConversations;
        setFloatConversations(_floatConversations);
        window.ngdox_messenger_activeConversation = null;
    }

    /**
     * on active Conversation
     * @param {*} id
     */
    const activeConversation = (id) => {
        if (id) {
            // deactive previous conversation
            let actived = window.ngdox_messenger_activeConversation;
            if (actived !== id) {
                if (actived) {
                    setTimeout(() => {
                        let removeHeader = document.getElementById(`conversation_header_${actived}`);
                        if (removeHeader) {
                            removeHeader.classList.remove("header-active");
                        }
                    }, 100);
                }

                // send web socket event to active
                window.ngdox_messenger_activeConversation = id;

                setTimeout(() => {
                    let activeHeader = document.getElementById(`conversation_header_${id}`);
                    if (activeHeader) {
                        activeHeader.classList.add("header-active");
                    }
                }, 100);
            }
        }
    }

    /**
     * on active Conversation
     * @param {*} id
     */
    const deactiveConversation = (id) => {
        // deactive previous conversation
        let actived = window.ngdox_messenger_activeConversation;
        if (actived === id) {
            window.ws_sendMessage(JSON.stringify({
                cmd: "event",
                convId: actived,
                payload: {
                    type: "INACTIVE"
                }
            }));

            setTimeout(() => {
                let removeHeader = document.getElementById(`conversation_header_${actived}`);
                if (removeHeader) {
                    removeHeader.classList.remove("header-active");
                }
            }, 100);

        }
        window.ngdox_messenger_activeConversation = null;
    }

    /**
     * close minimized conversation
     * @param {*} id
     */
    const closeMinimizedConversation = (id) => {
        let _filter = floatConversations.filter(f => f.id !== id);
        refFloating.current = _filter;
        setFloatConversations(_filter);
    }

    /**
     * open full message
     * @param {*} mode
     */
    const openFullMessage = (mode) => {
        refMessengerPanel.current.hide();
        if (mode === "dialog") {
            setShowMessengerDialog(true);
        } else {
            history.push("/messenger");
        }

    }

    return (<>
        <OverlayPanel ref={refMessengerPanel} id="messenger_panel" className="topbar-messenger-panel">
            <div className="p-d-flex p-ai-center p-jc-between p-p-2-5 p-pb-1">
                <XLayout_Title className="p-mt-0">{t("common.messenger")}</XLayout_Title>
                <div>
                    <Button
                        icon="bx bx-expand"
                        label={t("messenger.view-all")}
                        className="p-button-text p-button-rounded"
                        tooltipOptions={{ position: "bottom" }}
                        onClick={(e) => refOpenFullScreen.current.toggle(e)}
                    ></Button>
                    <OverlayPanel ref={refOpenFullScreen} className='x-menu'>
                        <div className="x-menu-button" onClick={() => openFullMessage("dialog")}>
                            <i className="bx bxs-window-alt"></i>
                            <span>{t("message.all-message.mode.dialog")}</span>
                        </div>
                        <div className="x-menu-button" onClick={() => openFullMessage("full")}>
                            <i className="bx bx-window"></i>
                            <span>{t("message.all-message.mode.full")}</span>
                        </div>
                    </OverlayPanel>
                    <Button
                        icon="bx bx-edit"
                        label={t("button.create")}
                        className="p-button-text p-button-rounded"
                        tooltip={t("messenger.new-message")}
                        tooltipOptions={{ position: "bottom" }}
                        onClick={(e) => refCreateChatMenu.current.toggle(e)}
                    ></Button>
                </div>
            </div>

            <div className="p-px-2 p-mb-2">
                <span className="p-input-icon-left w100">
                    <i className="bx bx-search-alt" />
                    <InputText
                        onInput={(e) => CommonFunction.debounce(null, filterConversation, e.target.value)}
                        placeholder={t("search")}
                        className="w100"
                    ></InputText>
                </span>
            </div>

            {filterConversationKeyword && <XLayout_Title className="p-mt-0 p-ml-2">{t("messenger.conversation")}</XLayout_Title>}

            {conversations && conversations.data && conversations.data.length > 0 && conversations.data.map((conversation, index) => (<React.Fragment key={conversation.id}>
                {conversation.showDateGroup && <div className='conversation-date-group'>{conversation.msgDate}</div>}
                <div key={conversation.id} className="messenger-conversation" onClick={() => openFloatConversation(conversation)}>
                    <div className="conversation-avatar">
                        {conversation.private
                            ? <UserInfo id={conversation.partner} avatarSize="36px" showName={false} allowShowDetail={false}></UserInfo>
                            : <XAvatar size="36px" src={CommonFunction.getImageUrl(conversation.avatar, conversation.name)} ></XAvatar>
                        }
                        {conversation.private &&
                            <div className={classNames({ "user-online-status": true, "is-online": conversation.partnerOnline })}>
                            </div>
                        }
                    </div>
                    <div className="conversation-group-and-message">
                        <div className='conversation-name'>
                            {!conversation.private &&
                                <span className='bx bx-group text-grey-7 icon-size p-mr-1'></span>
                            }
                            <span className='display-name'>{conversation.name}</span>
                        </div>
                        <div className="conversation-last-message">
                            {renderMessageContent(conversation)}
                        </div>

                    </div>
                    <div className="conversation-last-message-time">
                        <span className="say-time">{conversation.msgTime}</span>
                        <div className='p-d-flex p-ai-center'>
                            {!conversation.notice && <span className='bx bx-bell-off icon-small text-grey'></span>}
                            <span className={classNames({ "unseen-count": true, "p-ml-1": conversation.current && conversation.current.unread })}>{conversation.current ? (conversation.current.unread || null) : null}</span>
                        </div>
                    </div>
                </div>
            </React.Fragment>))}

            {conversations && conversations.data && conversations.data.length === 0 &&
                <div className="p-d-flex p-flex-column p-jc-center p-ai-center p-mt-4">
                    <span className="bx bx-chat empty-conversation-icon fs-40 text-grey-5"></span>
                    <XLayout_Title className="empty-conversation-message fs-16 text-grey-7">{t("messenger.empty-conversation")}</XLayout_Title>
                    <Button
                        label={t("messenger.create-chat")}
                        className="primary p-my-2"
                        icon="bx bx-user"
                        style={{ width: "250px" }}
                        onClick={() => createChat()}
                    ></Button>
                    <Button
                        label={t("messenger.create-group-chat")}
                        className="primary"
                        icon="bx bx-group"
                        style={{ width: "250px" }}
                        onClick={() => createGroup()}
                    ></Button>
                </div>
            }

            {conversations && conversations.more &&
                <div className="load-more-conversations link-button" onClick={() => loadMore()}>
                    {t("common.load-more")}
                </div>
            }

            {filterConversationKeyword && <>
                <XLayout_Title className="p-ml-2">{t("messenger.people")}</XLayout_Title>
                {!(filteredPeople && filteredPeople.data && filteredPeople.data.length > 0) &&
                    <div className='p-ml-2 text-grey-7'>
                        {t("common.empty-data")}
                    </div>
                }
                {filteredPeople && filteredPeople.data && filteredPeople.data.length > 0 && filteredPeople.data.map(p => (
                    <div key={p.id} className='conversation-filted-people'>
                        <XAvatar
                            size="36px"
                            src={CommonFunction.getImageUrl(p.avatar, p.fullName, 36, 36)}
                            label={() =>
                                <div>
                                    <div>{p.fullName}</div>
                                    <div className='p-mt-1 text-grey-7'>{p.email}</div>
                                </div>
                            }
                        ></XAvatar>
                        <div className='p-d-flex p-ai-center'>
                            <Button className='p-button-text p-button-rounded' icon='bx bx-chat' onClick={() => onStartPaticipantChat(p)}></Button>
                        </div>
                    </div>
                ))}

            </>}

        </OverlayPanel>

        {floatConversations && floatConversations.length > 0 &&
            <div className="messenger-float-conversations">

                <div className="conversation-panels">
                    {floatConversations.filter(f => f.float).map(conversation => (
                        <XLayout_Box key={conversation.id} className="conversation-panel">
                            <Messenger_Conversation
                                float={true}
                                allowFileTypes={["*"]}
                                conversation={JSON.stringify(conversation)}
                                afterLeaveConversation={afterLeaveConversation}
                                onMinimize={onFloatConversationMinimize}
                                onClose={onFloatConversationClose}
                            ></Messenger_Conversation>
                        </XLayout_Box>
                    ))}
                </div>

                <div className="conversations-list">
                    <div className="conversations-actions dynamic-action" onClick={() => closeAllFloatConversation()}>
                        <i className="bx bx-x-circle"></i>
                    </div>

                    <div className="conversations-actions dynamic-action" onClick={() => minimizeAllFloatConversation()}>
                        <i className="bx bx-minus-circle"></i>
                    </div>

                    {floatConversations.filter(f => f.float === false).map(conversation => (
                        <div className="p-my-2 minimize-conversation" key={conversation.id} >
                            <div onClick={() => openFloatConversation(conversation)}>
                                {conversation.private
                                    ? <UserInfo id={conversation.partner} avatarSize="36px" showName={false} allowShowDetail={false}></UserInfo>
                                    : <XAvatar size="36px" src={CommonFunction.getImageUrl(conversation.avatar, conversation.name)} ></XAvatar>
                                }
                            </div>
                            <div className='minimize-conversation-close' title={t("button.close")}>
                                <span className='bx bx-x icon-big text-red' onClick={() => closeMinimizedConversation(conversation.id)}></span>
                            </div>
                        </div>
                    ))}

                    <div className="conversations-actions create-button" onClick={(e) => refCreateChatMenu.current.toggle(e)}>
                        <i className="bx bx-edit"></i>
                    </div>
                </div>
            </div>
        }

        <div
            className={classNames({
                "topbar-item topbar-notification": true,
                "has-notify": unread > 0
            })}
            onClick={(e) => { show(e) }}
        >
            <i className={classNames({
                "bx bx-chat text-grey-7 fs-20": true,
                "bx-tada": unread > 0
            })} />
            {unread > 0 &&
                <Badges
                    className={classNames({
                        "topbar-notification-badge": true,
                        "circle": unread < 10,
                        "fs-12": unread < 100,
                        "fs-10": unread > 99
                    })}
                    pill
                    severity="danger"
                >
                    {unread}
                </Badges>
            }
        </div>

        <OverlayPanel className="x-menu" ref={refCreateChatMenu}>
            <div className="x-menu-button" onClick={() => createChat()}>
                <i className='bx bx-user'></i>
                <span>{t("messenger.create-chat")}</span>
            </div>
            <div className="x-menu-button" onClick={() => createGroup()}>
                <i className='bx bx-group'></i>
                <span>{t("messenger.create-group-chat")}</span>
            </div>
        </OverlayPanel>

        <Dialog
            visible={showMessengerDialog}
            header={t("common.messenger")}
            modal
            className="wd-90"
            contentClassName='messenger-dialog'
            onHide={() => setShowMessengerDialog(false)}
        >
            {showMessengerDialog && <Messenger></Messenger>}
        </Dialog>

        <Messenger_Create ref={refMessengerCreateDialog} afterSubmit={afterConversationCreated}></Messenger_Create>
    </>);
}
