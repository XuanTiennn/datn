import React, {useContext, useEffect, useRef, useState} from 'react';
import classNames from "classnames";
import Badges from "../../../components/badge/Badges";
import {useTranslation} from "react-i18next";
import {Context} from "../../../store/Store";
import ReactionFunction from "../../../components/x-reaction/ReactionFunction";
import ChatApi from "../../../service/ChatApi";
import _ from "lodash";
import NewsFeedApi from "../../../service/NewsFeedApi";
import {XLayout, XLayout_Center} from "../../../components/x-layout/XLayout";
import CommonFunction from "../../../lib/common";
import XAvatar from "../../../components/x-avatar/XAvatar";
import {UserPopover} from "../../../components/popovers/user-popover/UserPopover";
import {Menu} from "primereact/menu";
import { Tooltip } from 'primereact/tooltip';
import XFilePreviewList from "../../../components/x-file-preview/XFilePreviewList";
import {OverlayPanel} from "primereact/overlaypanel";
import {TabPanel, TabView} from "primereact/tabview";
import XPopover from "../../../components/x-popover/XPopover";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import LoadingBar from "../../../components/loading/LoadingBar";
import {UserAC} from "../../../components/autocomplete/UserAC";
import XComments from "../../../components/x-comments/XComments";
import UserApi from "../../../service/UserService";
import TaskBaseApi from "../../../service/TaskBaseApi";
import {Checkbox} from "primereact/checkbox";
import useWebSocket from "react-use-websocket";
import keycloak from "../../../keycloak";
import "./scss/Message.scss";

export const Message = (props) => {
    const colors = [
        {
            backgroundColor: 'rgb(0, 132, 255)',
            backgroundImage: 'radial-gradient(circle at center 75%, rgb(0, 178, 255) 0%, rgb(0, 38, 238) 100%)'
        },
        {
            backgroundColor: 'rgb(255, 153, 1)',
            backgroundImage: 'radial-gradient(circle at center 75%, rgb(255, 107, 0) 0%, rgb(255, 199, 0) 100%)'
        },
        {
            backgroundColor: 'rgb(0, 82, 205)',
            backgroundImage: 'radial-gradient(circle at center 75%, rgb(0, 82, 205) 0%, rgb(0, 161, 230) 50%, rgb(0, 82, 205) 100%)'
        },
        {
            backgroundColor: 'rgb(178, 19, 209)',
            backgroundImage: 'radial-gradient(circle at center 75%, rgb(159, 36, 255) 0%, rgb(201, 0, 157) 100%)'
        },
        {
            backgroundColor: 'rgb(159, 213, 45)',
            backgroundImage: 'radial-gradient(circle at center 75%, rgb(159, 213, 45) 0%, rgb(0, 191, 145) 50%, rgb(42, 127, 227) 100%)'
        },
        {
            backgroundColor: 'rgb(40, 37, 181)',
            backgroundImage: 'radial-gradient(circle at center 75%, rgb(40, 37, 181) 0%, rgb(51, 18, 144) 50%, rgb(94, 0, 126) 100%)'
        },
        {
            backgroundColor: 'rgb(102, 169, 255)',
            backgroundImage: 'radial-gradient(circle at center 75%, rgb(64, 159, 255) 0%, rgb(140, 179, 255) 100%)'
        },
        {
            backgroundColor: 'rgb(141, 89, 28)',
            backgroundImage: 'radial-gradient(circle at center 75%, rgb(141, 89, 28) 0%, rgb(170, 122, 37) 50%, rgb(207, 180, 111) 100%)'
        },
        {
            backgroundColor: 'rgb(242, 92, 84)',
            backgroundImage: ''
        },
        {
            backgroundColor: 'rgb(110, 223, 0)',
            backgroundImage: ''
        },
        {
            backgroundColor: 'rgb(0, 153, 255)',
            backgroundImage: ''
        },
        {
            backgroundColor: 'rgb(96, 96, 96)',
            backgroundImage: ''
        },
    ];

    const mentions = [
        {
            trigger: "@",
            renderer: (mentionPart) => (
                <UserPopover
                    user={{ id: mentionPart.id, fullName: mentionPart.value }}
                    title={() => (<span className="x-message-message-mention">{mentionPart.value}</span>)} />
            )
        }
    ];

    const defaultConfigConversation = {
        background: "rgb(0, 132, 255)",
        notification: "on",
        color: "rgb(255, 255, 255)"
    }

    const defaultConversation = {
        type: "",
        name: "",
        users: [],
        members: [],
    };

    const defaultPaging = {
        first: 0,
        size: 20,
        page: 0,
        total: 0
    };

    const { t } = useTranslation();
    const [state, dispatch] = useContext(Context);

    const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
    const [loadingFilterMessage, setLoadingFilterMessage] = useState(false);
    const [totalFilterMessage, setTotalFilterMessage] = useState(0);

    const [chatBox, setChatBox] = useState(false);
    const [loadingConversation, setLoadingConversation] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [membersBox, setMembersBox] = useState(false);

    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [conversation, setConversation] = useState(defaultConversation);
    const [conversations, setConversations] = useState([]);

    const [moreConversation, setMoreConversation] = useState(true); // có còn conversation để load ko
    const [moreMessage, setMoreMessage] = useState(true); // có còn message để load ko
    const [users, setUsers] = useState(null);
    const [latestDate, setLatestDate] = useState(new Date());
    const [rootMessages, setRootMessages] = useState(null);
    const [allMessages, setAllMessages] = useState([]);
    const [messages, setMessages] = useState(null);
    const [resultFilterMessage, setResultFilterMessage] = useState(null);
    const [currentIndexSearch, setCurrentIndexSearch] = useState(-1);
    const [userTyping, setUserTyping] = useState(null);
    const [onTyping, setOnTyping] = useState(false);
    const [timeoutTyping, setTimeoutTyping] = useState(null);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [editTitleRoom, setEditTitleRoom] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showInformation, setShowInformation] = useState(false);
    const [showDetailUser, setShowDetailUser] = useState(false);
    const [showConversationConfig, setShowConversationConfig] = useState(false);
    const [showFilterMessage, setShowFilterMessage] = useState(false);
    const [newMessage, setNewMessage] = useState(false);
    const [parentMessage, setParentMessage] = useState(null);
    const [scrollChatLog, setScrollChatLog] = useState(false);
    const [newMessageOnScroll, setNewMessageOnScroll] = useState(false);
    const [buttonScrollBottom, setButtonScrollBottom] = useState(false);

    const refToken = useRef(null);
    const socketRef = useRef();
    const refWebSocket = useRef(null);
    const refSocketSendMessage = useRef(null);
    const refSocketLastMessage = useRef(null);
    const refSocketReadyState = useRef(null);

    const regexes = useRef(null);
    const refInputText = useRef(null);
    const refFilterValue = useRef(null);

    const [socketUrl, setSocketUrl] = useState(null);

    const {
        sendMessage,
        sendJsonMessage,
        lastMessage,
        lastJsonMessage,
        readyState,
        getWebSocket
    } = useWebSocket(socketUrl, {
        onOpen: (event) => console.log('WS has opened'),
        onMessage: (event) => onWebSocketMessage(event),
        onClose: (event) => {
            console.log('WS has closed', event);

            console.log('Reconnecting...')
            let address = process.env.REACT_APP_WEB_SOCKET + `${keycloak.token}`;
            refToken.current = keycloak.token;
            setSocketUrl(address);

            // check token change after 15s
            setInterval(() => {
                if (keycloak.token !== refToken.current) {
                    console.log("Refresh ws");
                    refToken.current = keycloak.token
                    let newAddress = process.env.REACT_APP_WEB_SOCKET + `${keycloak.token}`;
                    setSocketUrl(newAddress);
                }
            }, 15000);
        },
        // Will attempt to reconnect on all close events, such as server shutting down
        reconnectAttempts: 10,
        reconnectInterval: 15000,
        retryOnError: true,
        shouldReconnect: (closeEvent) => true,
    });

    /**
     * on websocket message
     */
    const onWebSocketMessage = (event) => {
        // new message coming
        console.log(event);

        try {
            if (event && event.data) {
                let data = JSON.parse(event.data);
                if (data) {
                    let senderMessage;
                    const users = JSON.parse(localStorage.getItem('USERS'));
                    const conversationId = localStorage.getItem('CONVERSATION');
                    if (users && users.length > 0) {
                        senderMessage = users.filter(user => user.id === data.from)[0];
                    }

                    // check xem message có phải từ thằng đang chat ko (lưu id thằng đang chat vào local storage)
                    // nếu đúng thì update vào chỗ đang chat luôn, nếu ko thì chuyển sang notification
                    if (data.typing !== undefined) {
                        if (data.typing && senderMessage) {
                            data.senderId = senderMessage.id;
                            data.sender = senderMessage;
                            dispatch({ type: 'SET_USER_TYPING', payload: data })
                        } else {
                            dispatch({ type: 'SET_USER_TYPING', payload: null })
                        }
                    } else if (data.from && data.convId && conversationId == data.convId && senderMessage) {
                        prepareMessageData(data);
                        dispatch({ type: 'SET_MESSAGE', payload: data });
                    } else {
                        prepareMessageData(data);
                        dispatch({ type: 'SET_MESSAGE', payload: data });

                        if (data.convId && data.typing === undefined) {
                            if (data.from !== state.user.id) {
                                data.createDate = new Date();
                                if (!chatBox || (currentConversation && currentConversation.id !== data.convId)) {
                                    setTotalUnreadMessages(totalUnreadMessages + 1);
                                }
                                if (!chatBox) {
                                    CommonFunction.notifyInfo(data.content, data.subject);
                                }
                            }
                        } else {
                            data.createDate = new Date();
                            dispatch({ type: 'ADD_NEW_NOTIFICATIONS', payload: [data] });
                            CommonFunction.notifyInfo(data.content, data.subject);
                        }
                    }
                }
            }
        } catch (error) {
            console.log("get websocket data error", error);
        }
    }

    /**
    * prepare messages
    * @param {*} messages
    */
    const prepareMessages = (_messages) => {
        let _regexes = regexes.current || prepareRegexes();

        _messages.forEach(_message => {
            if (!_message.prepared) {
                let emojiCount = 0;

                // prepare word break
                // --------------------------------------
                if (_message.content) {
                    _message.content = _message.content.replaceAll("\n", "<br/>");
                }

                // prepare mentions
                // --------------------------------------
                if (_message.content) {
                    let matches = [];
                    // find all matching
                    _regexes.forEach(regex => {
                        let regexMatches = _message.content.match(regex.regex);
                        if (regexMatches && regexMatches.length > 0) {
                            regexMatches.forEach(regexMatch => {
                                if (!matches.find(f => f.match === regexMatch)) {
                                    matches.push({
                                        ...regex,
                                        match: regexMatch
                                    })
                                }
                            })
                        }
                    });

                    // add ||| to split _message to groups
                    let _content = _message.content;
                    if (matches.length > 0) {
                        matches.forEach(match => {
                            _content = _content.replaceAll(match.match, `|||${match.match}|||`)
                        });
                    }

                    // prepare each part of _message
                    _message.preparedContent = [];
                    _content.split("|||").forEach(part => {
                        let mention = matches.find(f => f.match === part);
                        if (mention) {
                            let p = {
                                type: "mention",
                                trigger: mention.trigger,
                                mentionIndex: mention.index,
                                content: part
                            }

                            let split = part.substr(2, part.length - 3).split("](");
                            if (split.length === 2) {
                                p.value = split[0];
                                p.id = split[1];
                            }

                            // count emoji
                            if (part.startsWith(":[")) emojiCount += 1;

                            _message.preparedContent.push(p);
                        } else {
                            _message.preparedContent.push({
                                content: part
                            })
                        }
                    });
                }

                // prepare all emoji comment
                // ....................................................
                if (emojiCount > 0 && _message.preparedContent.length === emojiCount) {
                    _message.className = emojiCount === 1 ? "x-comment-single-emoji" : "x-comment-multi-emoji";
                }

                // mark _message prepared
                // ----------------------------------
                _message.prepared = true;
            }
        });
    };

    /**
     * prepare regexes
     */
    const prepareRegexes = () => {
        let _regexes = [];

        if (mentions && mentions.length > 0) {
            mentions.forEach((mention, index) => {
                _regexes.push({
                    trigger: mention.trigger,
                    index: index,
                    regex: RegExp(`${mention.trigger}\\[(?<value>.*?)\\]\\((?<id>.*?)\\)`, "gm")
                })
            });
        }

        // emoji trigger
        _regexes.push({
            trigger: ":",
            index: _regexes.length,
            regex: RegExp(`:\\[(?<value>.*?)\\]\\((?<id>.*?)\\)`, "gm"),
            renderer: (part) => (<img className="x-comment-comment-emoji" alt={part.value} src={CommonFunction.getEmoji(part.id)}></img>)
        })

        regexes.current = _regexes;
        return _regexes;
    }

    const prepareMessageData = (data) => {
        let _conversation = _.cloneDeep(conversations).filter(_obj => _obj.id === data.convId)[0];

        if (_conversation && _conversation.involves && _conversation.involves.length > 0) {
            const senderMessage = _conversation.involves.filter(_involve => _involve.userDTO.id === data.from)[0].userDTO;

            if (senderMessage) {
                data.senderId = senderMessage.id;
                data.sender = senderMessage;
            }
        }
        if (!data.type) {
            data.type = 'TEXT';
        }
    }

    useEffect(() => {
        loadConversation({...defaultPaging, size: 999}, []);
        if (localStorage.getItem('CONVERSATION')) {
            localStorage.removeItem('CONVERSATION');
        }
        if (localStorage.getItem('USERS')) {
            localStorage.removeItem('USERS');
        }
    }, [])

    // default previous language
    useEffect(() => {
        console.log('Connecting...')
        let address = process.env.REACT_APP_WEB_SOCKET + `${keycloak.token}`;
        refToken.current = keycloak.token;
        setSocketUrl(address);

        // check token change after 15s
        setInterval(() => {
            if (keycloak.token !== refToken.current) {
                console.log("Refresh ws");
                refToken.current = keycloak.token
                let newAddress = process.env.REACT_APP_WEB_SOCKET + `${keycloak.token}`;
                setSocketUrl(newAddress);
            }
        }, 15000);
    }, [state.user]);

    useEffect(() => {
        if (chatBox && currentConversation && currentConversation.involves && currentConversation.involves.length > 0) {
            const users = currentConversation.involves.map(involve => involve.userDTO);

            localStorage.setItem("USERS", JSON.stringify(users));
            localStorage.setItem("CONVERSATION", currentConversation.id);

            refInputText.current.focus();
            setShowFilterMessage(false);
        }
        if (currentConversation) {
            ChatApi.updateUserActivity({ convId: currentConversation.id }).then(res => console.log('Access...', res));
        }
    }, [currentConversation]);

    useEffect(() => {
        if (rootMessages) {
            let _allMessages = _.cloneDeep(allMessages ? allMessages : []);

            _allMessages = _.uniqBy([...rootMessages, ..._allMessages], 'id');

            setAllMessages(_allMessages);
        }
    }, [rootMessages]);

    useEffect(() => {
        if (state.message.lastMessage) {
            if (chatBox && currentConversation && state.message.lastMessage.convId === currentConversation.id) {
                const _latestMessage = {...state.message.lastMessage, createDate: CommonFunction.formatDateISO8601(new Date()), read: true};

                let _rootMessages = _.cloneDeep(rootMessages);

                const messagePending = _rootMessages.find(_msg => _msg.id === _latestMessage.id && _msg.state === 'pending') ? true : false;

                if (messagePending) {
                    _rootMessages = _rootMessages.map(_msg => {
                        if (_msg.id === _latestMessage.id && _msg.state === 'pending') {
                            return {
                                ..._latestMessage,
                                state: 'done'
                            }
                        }
                        return _msg;
                    })
                } else {
                    _rootMessages = [_latestMessage, ..._rootMessages];
                }

                prepareMessages(_rootMessages);

                rebindMessage(_rootMessages, currentConversation);

                let result = buildObjectMessage(_rootMessages);

                setMessages(result);
                setRootMessages(_rootMessages);

                let _conversations = _.cloneDeep(conversations);

                const _conversationOfMessage = _.cloneDeep(_conversations).find(_conversation => _conversation.id === _latestMessage.convId);

                _conversations = reOrderConversation(_conversations, _conversationOfMessage);

                setConversations(_conversations);

                if (_latestMessage.sender && _latestMessage.sender.id !== state.user.id && scrollChatLog) {
                    setNewMessageOnScroll(_latestMessage);
                }
            } else {
                const _latestMessage = {...state.message.lastMessage, createDate: CommonFunction.formatDateISO8601(new Date()), read: false};

                let _allMessages = _.cloneDeep(allMessages);

                const messagePending = _allMessages.find(_msg => _msg.id === _latestMessage.id && _msg.state === 'pending') ? true : false;

                if (messagePending) {
                    _allMessages = _allMessages.map(_msg => {
                        if (_msg.id === _latestMessage.id && _msg.state === 'pending') {
                            return {
                                ..._latestMessage,
                                state: 'done'
                            }
                        }
                        return _msg;
                    })
                } else {
                    _allMessages = [_latestMessage, ..._allMessages];
                }

                let _conversations = _.cloneDeep(conversations);

                if (_conversations && _conversations.length > 0) {
                    _conversations = _conversations.map(_conversation => {
                        if (_conversation.id === _latestMessage.convId) {
                            return { ..._conversation, unread: _conversation.unread ? _conversation.unread + 1 : 1}
                        }
                        return _conversation;
                    });

                    const _conversationOfMessage = _.cloneDeep(_conversations).find(_conversation => _conversation.id === _latestMessage.convId);

                    _conversations = reOrderConversation(_conversations, _conversationOfMessage);

                    setConversations(_conversations);

                    prepareMessages(_allMessages);

                    rebindMessage(_allMessages, _conversationOfMessage);

                    setAllMessages(_allMessages);
                }
            }
            if (chatBox && !buttonScrollBottom) {
                let chatLogContainer = document.getElementsByClassName('chat-box-content-detail')[0];
                chatLogContainer.scrollTop = 0;
            }
        }
    }, [state.message.lastMessage]);

    useEffect(() => {
        setUserTyping(state.message.userTyping);
    }, [state.message.userTyping]);

    useEffect(() => {
        if (parentMessage) {
            refInputText.current.focus();
        }
    }, [parentMessage])

    useEffect(() => {
        if (!showFilterMessage) {
            setTotalFilterMessage(0);
            setResultFilterMessage(null);
            loadMessages(currentConversation, new Date(), [], true, defaultPaging);
        }
    }, [showFilterMessage]);

    useEffect(async () => {
        if (resultFilterMessage && currentIndexSearch > -1 && currentIndexSearch < resultFilterMessage.length && refFilterValue.current) {

            let _messages = _.cloneDeep(rootMessages);

            const isFound = _messages.find(_message => _message.id === resultFilterMessage[currentIndexSearch].id) ? true : false;

            if (!isFound) {
                let _latestDate = new Date(_.cloneDeep(resultFilterMessage[currentIndexSearch].createDate));
                _latestDate.setTime(_latestDate.getTime() + (60 * 1000));
                _messages = await loadMessages(currentConversation, new Date(_latestDate), _.cloneDeep(rootMessages), true);
            }

            _messages = _messages.map(_message => {
                if (!_message.found) {
                    // Analyze mentions
                    // _message.preparedContent = _message.preparedContent.map(_prepareContent => {
                    //     let _content = "";
                    //
                    //     switch (_prepareContent.type) {
                    //         case "mention":
                    //             debugger
                    //             _prepareContent.value.split(" ").forEach(el => {
                    //                 if (refFilterValue.current.split(" ").includes(el.toLowerCase())) {
                    //                     _content += ` <span style="background: #f7b928">${el}</span> `
                    //                 } else {
                    //                     _content += ` ${el} `
                    //                 }
                    //             });
                    //             return {..._prepareContent, value: _content}
                    //             break;
                    //         default:
                    //             _prepareContent.content.split(" ").forEach(el => {
                    //                 if (refFilterValue.current.split(" ").includes(el.toLowerCase())) {
                    //                     _content += ` <span style="background: #f7b928">${el}</span> `
                    //                 } else {
                    //                     _content += ` ${el} `
                    //                 }
                    //             });
                    //             return {..._prepareContent, content: _content}
                    //             break;
                    //     }
                    // });

                    // Not analyze mentions
                    let _content = "";

                    _message.content.split(" ").forEach(el => {
                        if (refFilterValue.current.split(" ").includes(el.toLowerCase())) {
                            _content += ` <span style="background: #f7b928">${el}</span> `
                        } else {
                            _content += ` ${el} `
                        }
                    });
                    return {
                        ..._message,
                        found: true,
                        content: _content.trim(),
                        preparedContent: [{content: _content.trim()}]
                    }
                    return _message;
                }
                return _message;
            });

            let result = buildObjectMessage(_messages);
            setMessages(result);

            document.getElementById(`content_${resultFilterMessage[currentIndexSearch].id}`).scrollIntoView();
        }
    }, [currentIndexSearch])

    const reOrderConversation = (_conversations, _toFirst) => {
        return [ _toFirst, ..._conversations.filter(_conversation => _conversation.id !== _toFirst.id) ];
    }

    const loadConversation = (_lazyParams = defaultPaging, defaultConversation = conversations) => {
        setLoadingConversation(true);

        ChatApi.getConversation(_lazyParams).then(async res => {
            if (res && res.content && res.content.length > 0) {
                let _conversation = _.cloneDeep(defaultConversation);

                if (_conversation && _conversation.length > 0) {
                    _conversation = _conversation.concat(res.content);
                } else {
                    _conversation = res.content;
                }

                setLatestDate(new Date());
                setMessages([]);

                for (let _obj of _conversation) {
                    if (_obj.id !== _conversation[0].id) {
                        await loadMessages(_obj, new Date(), [], false, {...defaultPaging, size: 1});
                    } else {
                        // await loadMessages(_obj, new Date(), [], true);
                    }
                }

                let _allMessages = _.cloneDeep(allMessages);

                if (_allMessages && _allMessages.length > 0) {
                    let _rootMessages = _allMessages.filter(_message => _message.convId === _conversation[0].id)

                    if (_rootMessages && _rootMessages.length > 0) {
                        let result = buildObjectMessage(_rootMessages);
                        setRootMessages(_rootMessages);
                        setMessages(result);
                    } else {
                        await loadMessages(_conversation[0], new Date(), [], true);
                    }
                } else {
                    await loadMessages(_conversation[0], new Date(), [], true);
                }

                setCurrentConversation(_conversation[0]);
                setConversations(_conversation);
                setTotalUnreadMessages(_conversation.map(_obj => _obj.unread).reduce((a, b) => a + b, 0));

                // nếu số dữ liệu load ra < pageSize thì tức là đã hết bài để load, nếu = tức là vẫn có thể còn bài để load
                // setMore(res.content.length === pageSize);
                setMoreConversation(res.total > _conversation.length);
            } else {
                setConversations([]);
            }
            setLoadingConversation(false);
            setConversation(defaultConversation);
        });
    }

    const loadMessages = (_currentConversation, _latestDate = latestDate, _defaultRootMessage = [], _buildMessage = false, _defaultPaging = defaultPaging) => {
        if (_currentConversation && _currentConversation.involves && _currentConversation.involves.length > 0) {
            setLoadingMessage(true);
            setIsAdmin(_currentConversation.involves.find(involve => involve.userDTO.id === state.user.id).role === "ADMIN" ? true : false);
            return new Promise(resolve => {
                ChatApi.getMessageByConversation({ ..._defaultPaging, convId: _currentConversation.id, latestDate: CommonFunction.formatDateISO8601(_latestDate) }).then(res => {
                    let _rootMessages = _.cloneDeep(_defaultRootMessage);

                    rebindMessage(res.content, _currentConversation);

                    prepareMessages(res.content);

                    let _allMessages = _.cloneDeep(allMessages);

                    if (_allMessages && _allMessages.length > 0) {
                        _allMessages = _allMessages.filter(_message => _message.convId !== _currentConversation.id);

                        setAllMessages(_allMessages);
                    }

                    if (_rootMessages && _rootMessages.length > 0) {
                        _rootMessages = _rootMessages.concat(res.content);
                    } else {
                        _rootMessages = res.content;
                    }

                    let _latestMessageDate = _.cloneDeep(_latestDate);

                    _rootMessages.forEach(message => {
                        if (new Date(message.createDate).getTime() < _latestMessageDate.getTime()) {
                            _latestMessageDate = new Date(message.createDate);
                        }
                    });

                    setLatestDate(_latestMessageDate);
                    setRootMessages(_rootMessages);

                    if (_buildMessage) {
                        let result = buildObjectMessage(_rootMessages);

                        setMoreMessage(res.total > _rootMessages.length);
                        setMessages(result);
                    }

                    setLoadingMessage(false);
                    resolve(_rootMessages);
                });
            })
        }
    }

    const rebindMessage = (messages, _currentConversation) => {
        if (_currentConversation) {
            messages = messages.filter(_message => _message.convId === _currentConversation.id).map(_message => {
                if (_message.parentId) {
                    if (!_message.parent) {
                        _message.parent = _.cloneDeep(allMessages).filter(mgs => mgs.id === _message.parentId)[0];
                    }

                    const conversationInvolveParent = _currentConversation.involves.find(involve => involve.userDTO.id === _message.parent.senderId);

                    _message.parent = { ..._message.parent, sender: conversationInvolveParent.userDTO }
                }
                if (_message.status === 1) {
                    _message.state = 'done';
                }
                if (!_message.type) {
                    _message.type = 'TEXT';
                }

                const conversationInvolve = _currentConversation.involves.find(involve => involve.userDTO.id == _message.senderId);

                if (conversationInvolve) {
                    _message.sender = conversationInvolve.userDTO;
                }

                return _message;
            });
        }
    }

    const buildObjectMessage = (_rootMessages) => {
        let _messages = _.orderBy(_rootMessages, ['createDate'],['desc']);

        _messages = _messages.map(_message => ({ ..._message, groupDate: CommonFunction.formatDate(_message.createDate) }));

        return _(_messages)
            .groupBy('groupDate')
            .map(function(items, gDate) {
                const _mgs = [];
                let i = 0;
                _.orderBy(items, ['createDate'],['asc']).forEach((item) => {
                    if (_mgs && _mgs.length === 0) {
                        _mgs.push({
                            userId: item.senderId,
                            user: item.sender,
                            messages: [item]
                        });
                        i++;
                    } else {
                        if (_mgs[i - 1].userId === item.senderId) {
                            _mgs[i - 1].messages.push(item);
                        } else {
                            _mgs.push({
                                userId: item.senderId,
                                user: item.sender,
                                messages: [item]
                            });
                            i++;
                        }
                    }
                });
                return {
                    conversationDate: gDate,
                    messages: _mgs
                };
            }).value();
    };

    /**
     * event khi scroll message box
     * @param {*} e
     */
    const onMessageScroll = (e) => {
        if (e.target.scrollTop <= -160) {
            setScrollChatLog(true);
            setButtonScrollBottom(true);
        } else {
            if (e.target.scrollTop <= -160) {
                setScrollChatLog(true);
            } else {
                setNewMessageOnScroll(null);
                setScrollChatLog(false);
            }
            setButtonScrollBottom(false);
        }
        if (e.target.scrollTop < 0 && e.target.scrollHeight - 50 < e.target.clientHeight - e.target.scrollTop) {
            const _rootMessages = _.cloneDeep(allMessages).filter(_message => _message.convId === currentConversation.id);
            let _latestMessageDate = _.cloneDeep(new Date());

            if (_rootMessages && _rootMessages.length > 0) {
                _rootMessages.forEach(message => {
                    if (new Date(message.createDate).getTime() < _latestMessageDate.getTime()) {
                        _latestMessageDate = new Date(message.createDate);
                    }
                });
            }
            loadMessages(currentConversation, _latestMessageDate, _rootMessages, true)
        }
    }

    const onFilterConversation = (val) => {
        loadConversation({...defaultPaging, filter: val}, []);
    }

    const onFilterMessageInConversation = (val) => {
        setResultFilterMessage([]);
        setTotalFilterMessage(0);
        setCurrentIndexSearch(-1);
        let result = buildObjectMessage(rootMessages);
        setMessages(result);

        if (val) {
            refFilterValue.current = val
            setLoadingFilterMessage(true);
            let _keyword = '';
            val.split(" ").forEach((k, i) => {
                if (i === 0) {
                    _keyword = k;
                } else if (i > 0 && i < val.length - 1) {
                    _keyword += ' | ' + k;
                } else {

                }
            });
            ChatApi.getMessageByConversation({...defaultPaging, filter: _keyword, convId: currentConversation.id, latestDate: CommonFunction.formatDateISO8601(new Date())}).then(res => {
                if (res && res.content) {
                    setResultFilterMessage(res.content);
                    setTotalFilterMessage(res.total);
                    setCurrentIndexSearch(0);
                }
                setLoadingFilterMessage(false);
            })
        }
    }

    const createNewMessage = () => {
        setConversation(defaultConversation);
        setCurrentConversation(null);
        setRootMessages([]);
        setMessages(null);
        setNewMessage(true);
    }

    const openMessage = () => {
        if (loadingConversation) {
            return;
        }
        if (!conversations || conversations && conversations.length === 0) {
            loadConversation();
        } else {
            if (currentConversation && allMessages && allMessages.length > 0) {
                let _totalUnreadMessages = _.cloneDeep(totalUnreadMessages);

                let _allMessages = _.cloneDeep(allMessages);

                _allMessages = _allMessages.map(_message => {
                    if (_message.convId === currentConversation.id && !_message.read) {
                        _totalUnreadMessages = _totalUnreadMessages - 1;
                        return {
                            ..._message,
                            read: true
                        }
                    }
                    return _message;
                });

                setAllMessages(_allMessages);

                let _rootMessages = _allMessages.filter(_message => _message.convId === currentConversation.id);
                let result = buildObjectMessage(_rootMessages);
                setRootMessages(_rootMessages);
                setMessages(result);

                let _conversations = _.cloneDeep(conversations);

                _conversations = _conversations.map(_conversation => {
                    if (_conversation.id === currentConversation.id) {
                        return {
                            ..._conversation,
                            unread: 0
                        }
                    }
                    return _conversation;
                });

                setConversations(_conversations);
                setTotalUnreadMessages(_totalUnreadMessages);
            }
        }
        setChatBox(true);
    }

    const onHideChatBox = (e) => {
        setChatBox(false);
        setNewMessage(false);
        // setConversations([]);
        // setCurrentConversation(null);
        localStorage.removeItem('CONVERSATION');
        localStorage.removeItem('USERS');
    }

    const openDialogMembers = () => {
        setMembersBox(true);
    }

    const onFilterMemberToAdd = (val) => {
        if (val) {
            UserApi.search({
                filter: val,
                size: 999
            }).then(res => {
                if (res) {
                    setMembers(res.content);
                }
            })
        } else {
            setMembers([]);
        }
    }

    const onSelectedMemberChange = (val) => {
        if (selectedMembers && selectedMembers.length > 0) {
            const isExist = selectedMembers.filter(selected => selected.id === val.id).length > 0 ?  true : false;

            if (isExist) {
                let _selectedMembers = _.cloneDeep(selectedMembers);

                _selectedMembers = _selectedMembers.filter(selected => selected.id.indexOf(val.id) === -1);

                setSelectedMembers(_selectedMembers);
            } else {
                let _selectedMembers = _.cloneDeep(selectedMembers);

                _selectedMembers.push(val);

                setSelectedMembers(_selectedMembers);
            }
        } else {
            let _selectedMembers = [];

            _selectedMembers.push(val);

            setSelectedMembers(_selectedMembers);
        }
    }

    const addMember = () => {
        if (selectedMembers && selectedMembers.length > 0) {
            const payload = {
                convId: currentConversation.id,
                involves: {
                    "MEMBER": selectedMembers.map(selected => selected.id)
                }
            };
            ChatApi.addMember(payload).then(res => {
                let _conversations = _.cloneDeep(conversations);

                _conversations.forEach(_conversation => {
                    if (_conversation.id === currentConversation.id) {
                        selectedMembers.forEach(selected => {
                            let isExists = false;

                            if (_conversation.involves.length > 0) {
                                _conversation.involves = _conversation.involves.map(_involve => {
                                    if (_involve.userDTO.id === selected.id) {
                                        isExists = true;
                                        return {
                                            ..._involve,
                                            status: 1
                                        }
                                    }
                                    return _involve;
                                })
                            }
                            if (!isExists) {
                                _conversation.involves.push({
                                    companyId: 1,
                                    convId: 1,
                                    role: "MEMBER",
                                    userDTO: selected
                                });
                            }
                        });
                    }
                });

                setConversations(_conversations);
                setCurrentConversation(_conversations.find(_conversation => _conversation.id === currentConversation.id));
                setSelectedMembers([]);
            });
        }
    }

    const renderHeaderChat = () => {
        let title = currentConversation.name;
        let avatar = CommonFunction.getImageUrl(currentConversation.avatar, currentConversation.name);

        if (currentConversation.type === "PRIVATE") {
            const involve = currentConversation.involves.find(involve => {
                if (involve.userDTO.id === state.user.id) {
                    return false;
                }
                return true;
            });
            if (involve) {
                title = involve.userDTO.fullName;
                avatar = CommonFunction.getImageUrl(involve.userDTO.avatar, involve.userDTO.fullName);
            } else {
                title = currentConversation.involves[0].userDTO.fullName;
                avatar = CommonFunction.getImageUrl(currentConversation.involves[0].userDTO.avatar, currentConversation.involves[0].userDTO.fullName);
            }
        }

        return (
            <React.Fragment>
                <XAvatar size="32px" className="img-circle-small" src={avatar}></XAvatar>
                <div className="p-d-flex p-flex-column p-jc-center p-pl-2">
                    <span className="fs-14 p-text-bold text-grey-8">{title}</span>
                    <span className="fs-12">{t('chat.user.online')}</span>
                </div>
                <span className="status"></span>
                <Button className="p-button-rounded p-button-text text-grey-9 p-ml-auto" title={t("chat.info-message")} icon="bx bxs-info-circle" onClick={(e) => {
                    setShowInformation(!showInformation);
                    setEditTitleRoom(false);
                }}></Button>
            </React.Fragment>
        )
    }

    const renderInformationConversation = () => {
        let title = currentConversation.name;
        let avatar = CommonFunction.getImageUrl(currentConversation.avatar, currentConversation.name);

        if (currentConversation.type === "PRIVATE") {
            const involve = currentConversation.involves.find(involve => {
                if (involve.userDTO.id === state.user.id) {
                    return false;
                }
                return true;
            });
            if (involve) {
                title = involve.userDTO.fullName;
                avatar = CommonFunction.getImageUrl(involve.userDTO.avatar, involve.userDTO.fullName);
            } else {
                title = currentConversation.involves[0].userDTO.fullName;
                avatar = CommonFunction.getImageUrl(currentConversation.involves[0].userDTO.avatar, currentConversation.involves[0].userDTO.fullName);
            }
        }

        return (
            <React.Fragment>
                <XAvatar size="100px" className="img-circle-small" src={avatar}></XAvatar>
                {!editTitleRoom && <span className="p-my-2 fs-22 p-text-bold">{title}</span>}
                {editTitleRoom && <InputText className="p-my-2 fs-22 dense" value={conversation.name} onChange={(e) => setConversation({...conversation, name: e.target.value})} /> }
            </React.Fragment>
        )
    }

    /**
     * render message part
     */
    const renderMessagePart = (part) => {
        let _mentions = regexes.current;
        switch (part.type) {
            case "mention":
                // render mention part
                if (_mentions[part.mentionIndex].renderer && typeof _mentions[part.mentionIndex].renderer === "function") {
                    return _mentions[part.mentionIndex].renderer(part);
                } else {
                    return <span className="x-message-message-mention">{part.value}</span>
                }
                break;
            default:
                // default return plain text
                return <span dangerouslySetInnerHTML={{ __html: CommonFunction.removeScriptTags(part.content) }}></span>
                break;
        }
    }

    return (<React.Fragment>
        <div
            className={classNames({
                "topbar-item topbar-chat": true,
                "has-notify": false
            })}
            onClick={(e) => openMessage()}>
            <i className={classNames({
                "bx bx-message-rounded fs-20": true,
                "message-icon": loadingConversation
            })} />
            {(totalUnreadMessages > 0 || loadingConversation) && <Badges
                className={classNames({
                    "topbar-chat-badge": true,
                    "circle": totalUnreadMessages < 10,
                    "fs-12": totalUnreadMessages < 100,
                    "fs-10": totalUnreadMessages > 99
                })}
                pill
                severity="danger"
            >
                {loadingConversation ? <i className='bx bx-loader-circle bx-spin' /> : totalUnreadMessages}
            </Badges>}
        </div>

        {chatBox && <Dialog visible={chatBox} maximizable className="chat-box" onHide={onHideChatBox}>
            <XLayout className="p-d-flex overflow-hidden">
                <div className="chat-box-list p-d-flex p-flex-column" style={{flex: '0 0 300px'}}>
                    <div className="chat-box-list-header">
                        <div className="p-d-flex p-jc-between p-ai-center p-mb-3">
                            <span className="text-muted fs-16">{t('chat.contacts')}</span>
                            <Button className="p-button-rounded p-button-text text-grey-9" title={t("chat.new-message")} icon="bx bxs-edit" onClick={(e) => createNewMessage()}></Button>
                        </div>
                        <div className="search-box p-mb-2">
                            <span className="w100">
                                <InputText
                                    className="w100"
                                    onInput={(e) => CommonFunction.debounce(null, onFilterConversation, e.target.value)}
                                    placeholder={t("search")}/>
                            </span>
                        </div>
                    </div>
                    <div className="chat-box-list-user p-d-flex p-flex-column" style={{flex: '1 1 auto'}}>
                        <LoadingBar loading={loadingConversation}/>
                        {(newMessage || !conversations || conversations.length === 0) && <div className="p-p-2 user-info active">
                            <div className="p-d-flex p-ai-center">
                                <XAvatar size="32px" className="img-circle-small" src="assets/images/default-avatar.png"></XAvatar>
                                <span className="fs-14 p-px-2 p-py-1" style={{fontWeight: '400'}}>{t('chat.new-message')}</span>
                                <i className='bx bxs-x-circle text-grey-9 fs-18 p-ml-auto' title={t('chat.close-message')} onClick={(e) => {
                                    setNewMessage(false);
                                    // setMessages([]);
                                    // setLatestDate(new Date);
                                    setCurrentConversation(conversations[0]);

                                    let _conversations = _.cloneDeep(conversations).map(_obj => {
                                        if (_obj.id === conversations[0].id) {
                                            return {..._obj, unread: 0};
                                        }

                                        return _obj;
                                    });

                                    setConversations(_conversations);

                                    let _allMessages = _.cloneDeep(allMessages);

                                    if (_allMessages && _allMessages.length > 0) {
                                        let _rootMessages = _allMessages.filter(_message => _message.convId === conversations[0].id).map(_message => ({..._message, read: true}));

                                        if (_rootMessages && _rootMessages.length > 0) {
                                            let result = buildObjectMessage(_rootMessages);
                                            setRootMessages(_rootMessages);
                                            setMessages(result);
                                        } else {
                                            loadMessages(conversations[0], new Date(), [], true);
                                        }
                                    }
                                }}/>
                            </div>
                        </div>}

                        {conversations && conversations.length > 0 && conversations.map((_conversation, index) => {
                            let title = _conversation.name;
                            let avatar = CommonFunction.getImageUrl(_conversation.avatar, _conversation.name);

                            if (_conversation.type === 'PRIVATE') {
                                const involve = _conversation.involves.find(involve => {
                                    if (involve.userDTO.id === state.user.id) {
                                        return false;
                                    }
                                    return true;
                                });
                                if (involve) {
                                    title = involve.userDTO.fullName;
                                    avatar = CommonFunction.getImageUrl(involve.userDTO.avatar, involve.userDTO.fullName);
                                } else {
                                    title = _conversation.involves[0].userDTO.fullName;
                                    avatar = CommonFunction.getImageUrl(_conversation.involves[0].userDTO.avatar, _conversation.involves[0].userDTO.fullName);
                                }
                            }

                            const _messageInConversation = _.cloneDeep(allMessages).filter(_message => _message.convId === _conversation.id);

                            let _newestMessage = _.maxBy(_messageInConversation, 'createDate');
                            let sender = null;

                            if (_newestMessage && _newestMessage.sender) {
                                sender = _newestMessage.sender.id === state.user.id ? t('chat.message.yourself') : _newestMessage.sender.lastName;
                            }
                            if (_newestMessage && _newestMessage.type === 'FILE') {
                                sender += ` ${t('chat.message.file.attachment')}`;
                            }

                            return (<div key={_conversation.id} className={classNames({
                                "p-p-2": true,
                                "user-info": true,
                                "active": (currentConversation && _conversation.id === currentConversation.id) && !newMessage ? true : false
                            })} onClick={(e) => {
                                setNewMessage(false);
                                setMessages([]);
                                setCurrentConversation(_conversation);
                                let _conversations = _.cloneDeep(conversations).map(_obj => {
                                    if (_obj.id === _conversation.id) {
                                        return {..._obj, unread: 0};
                                    }

                                    return _obj;
                                });

                                setConversations(_conversations);
                                setLatestDate(new Date());
                                setEditTitleRoom(false);

                                let _allMessages = _.cloneDeep(allMessages);

                                if (_allMessages && _allMessages.length > 0) {
                                    let _rootMessages = _allMessages.filter(_message => _message.convId === _conversation.id);

                                    const _totalUnreadMessages = _rootMessages.filter(_message => !_message.read).length;

                                    setTotalUnreadMessages(totalUnreadMessages - _totalUnreadMessages);

                                    if (_rootMessages.filter(_message => !_message.from) && _rootMessages.filter(_message => !_message.from).length > 1) {
                                        _rootMessages = _rootMessages.map(_message => ({..._message, read: true}));
                                        let result = buildObjectMessage(_rootMessages);
                                        setRootMessages(_rootMessages);
                                        setMessages(result);
                                    } else {
                                        loadMessages(_conversation, new Date(), [], true);
                                    }
                                }
                            }}>
                                <div className="p-d-flex p-ai-center p-jc-between">
                                    <div className="p-d-flex p-ai-center">
                                        <div className="p-d-flex p-ai-center">
                                            <XAvatar size="32px" className="img-circle-small" src={avatar}></XAvatar>
                                            <span className="status"></span>
                                        </div>
                                        <div className="p-d-flex p-flex-column">
                                            <span className="fs-14 p-px-2 p-py-1" style={{fontWeight: ((currentConversation && currentConversation.id !== _conversation.id) || (!currentConversation)) && _newestMessage && !_newestMessage.read && _newestMessage.senderId !== state.user.id ? '600' : '400'}}>{title}</span>
                                            {_newestMessage && _newestMessage.type === 'TEXT' && _newestMessage.sender && <span className="p-px-2 p-text-nowrap p-text-truncate" style={{maxWidth: '14rem', maxHeight: '1.25rem'}}>
                                                    {(_conversation.type === 'GROUP' || _newestMessage.sender && _newestMessage.senderId === state.user.id) && <span className={classNames({
                                                        "p-text-bold": ((currentConversation && currentConversation.id !== _conversation.id) || (!currentConversation)) && _newestMessage && !_newestMessage.read && _newestMessage.senderId !== state.user.id
                                                    })}>{sender}: </span>}
                                                <span className={classNames({
                                                    "p-text-bold": ((currentConversation && currentConversation.id !== _conversation.id) || (!currentConversation)) && _newestMessage && !_newestMessage.read && _newestMessage.senderId !== state.user.id
                                                })}>{_newestMessage.preparedContent && _newestMessage.preparedContent.length > 0 && _newestMessage.preparedContent.map((part, partIndex) => (
                                                    <React.Fragment key={partIndex}>
                                                        {renderMessagePart(part)}
                                                    </React.Fragment>
                                                ))}</span>
                                            </span>}
                                            {_newestMessage && _newestMessage.type === 'FILE' && _newestMessage.sender && <span className="p-px-2 p-text-nowrap p-text-truncate" style={{maxWidth: '14rem', maxHeight: '1.25rem'}}>
                                                {_newestMessage.sender && <span className={classNames({
                                                    "p-text-bold": ((currentConversation && currentConversation.id !== _conversation.id) || (!currentConversation)) && _newestMessage && !_newestMessage.read && _newestMessage.senderId !== state.user.id
                                                })}>{sender}</span>}
                                            </span>}
                                        </div>
                                    </div>
                                    {_conversation.config && _conversation.config.notification === 'on' && _conversation.unread > 0 && <Badges
                                        className={classNames({
                                            "fs-12": true,
                                        })}
                                        pill
                                        severity="danger"
                                    >
                                        {_conversation.unread > 0 ? <p>{_conversation.unread}</p> : null}
                                    </Badges>}
                                    {_conversation.config && _conversation.config.notification === 'off' && <i className='bx bxs-bell-off p-px-1 fs-18 text-grey'/>}
                                </div>
                            </div>)
                        })}
                    </div>
                </div>
                <div className="chat-box-content p-d-flex p-flex-column" style={{flex: '1 1 auto'}}>
                    {(newMessage || !currentConversation) && <>
                        <div className="p-d-flex chat-box-content-header p-p-2">
                            <div className="p-d-flex p-ai-center">
                                <span className="p-pr-2">{t('chat.to')}:</span>
                                <UserAC className="input-new-message w100"
                                        placeholder="Nhập tên của người"
                                        value={conversation.users}
                                        onChange={(e) => {
                                            const ids = [...e.value.map(user => user.id)];

                                            if (ids.length === 1) {
                                                ChatApi.getConversationByUser(ids.toString()).then(res => {
                                                    if (res.id) {
                                                        setLatestDate(new Date());
                                                        setMessages([]);
                                                        setCurrentConversation(res);
                                                        loadMessages(res, new Date(), [], true);
                                                    }
                                                });
                                            } else {
                                                setMessages([]);
                                                setCurrentConversation(null);
                                            }

                                            setConversation({...conversation, users: e.value, members: ids});
                                        }}
                                />
                            </div>
                        </div>
                        <div className="chat-box-content-detail p-d-flex p-flex-column-reverse p-p-2" style={{flex: '1 1 auto'}} onScroll={(e) => CommonFunction.debounce(200, () => {
                            onMessageScroll(e)
                        })}>
                            {currentConversation && <React.Fragment>
                                {messages && messages.length > 0 && messages.map((message, index) => {
                                    return (
                                        <div key={index + '_conversation'}>
                                            <p className="tiny p-text-center text-grey-7 p-my-2">{message.conversationDate}</p>
                                            {message.messages && message.messages.length > 0 && message.messages.map((_message, _index) => {
                                                if (_message.userId === state.user.id) {
                                                    return (
                                                        <div key={_index + '_message'}>
                                                            <div className="p-d-flex p-flex-column p-pl-2 p-ai-end">
                                                                {_message.messages && _message.messages.length > 0 && _message.messages.map((mgs, i) => <XMessage mentions={mentions} regexes={regexes} message={mgs.content} config={currentConversation.config ? currentConversation.config : defaultConfigConversation} messages={_message} index={i} key={'content_' + _message.messages[i].id}
                                                                                                                                                                  fromCurrentUser={true} selectMessage={(val) => setParentMessage(val)} setMessage={(val) => {
                                                                    let _messages = _.cloneDeep(messages);

                                                                    _messages[index].messages[_index].messages = val;

                                                                    setMessages(_messages);
                                                                }}/>)}
                                                            </div>
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div key={_index + '_message'} className="p-d-flex">
                                                            <XAvatar size="28px" className="p-ai-end" src={CommonFunction.getImageUrl(_message.user.avatar, _message.user.fullName)}></XAvatar>
                                                            <div className="p-d-flex p-flex-column p-pl-2">
                                                                <span className="tiny text-grey p-pl-2">{_message.user.lastName}</span>
                                                                {_message.messages && _message.messages.length > 0 && _message.messages.map((mgs, i) => <XMessage mentions={mentions} regexes={regexes} message={mgs.content} config={currentConversation.config ? currentConversation.config : defaultConfigConversation} messages={_message} index={i} key={'content_' + _message.messages[i].id}
                                                                                                                                                                  fromCurrentUser={false} selectMessage={(val) => setParentMessage(val)}/>)}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                    )
                                })}
                            </React.Fragment>}
                            {loadingMessage && <div className="p-d-flex p-ai-center p-jc-center p-p-2">
                                <i className='bx bx-loader-circle bx-spin text-grey'></i>
                            </div>}
                        </div>
                    </>}
                    {!newMessage && currentConversation && <>
                        <div className="p-d-flex chat-box-content-header p-p-2">
                            <div className="p-d-flex p-ai-center w100">
                                {renderHeaderChat()}
                            </div>
                        </div>
                        {showFilterMessage && <div className="p-d-flex chat-box-content-search p-p-2">
                            <div className="p-d-flex p-ai-center w100">
                                <div className="search-box w100">
                                    <span className="p-input-icon-left position-relative w100 p-d-flex p-jc-end p-ai-center">
                                        <InputText
                                            className="w100"
                                            onInput={(e) => CommonFunction.debounce(null, onFilterMessageInConversation, e.target.value)}
                                            placeholder={t("search")}/>
                                        {totalFilterMessage > 0 && <span className="position-absolute p-pr-3 fs-12 text-grey-7">{totalFilterMessage} {t('chat.search.result')}</span>}
                                        {loadingFilterMessage && <div className="position-absolute p-pr-3">
                                            <i className="bx bx-loader-alt bx-spin fs-18 text-grey-7" />
                                        </div>}
                                    </span>
                                </div>
                                <div className={classNames({
                                    "previous-message": true,
                                    "active": resultFilterMessage && currentIndexSearch > -1 && currentIndexSearch < resultFilterMessage.length - 1
                                })} onClick={(e) => {
                                    if (currentIndexSearch > -1 && currentIndexSearch < resultFilterMessage.length - 1) {
                                        setCurrentIndexSearch(currentIndexSearch + 1);
                                    }
                                }}>
                                    <i className='bx bxs-chevron-up fs-18'></i>
                                </div>
                                <div className={classNames({
                                    "after-message": true,
                                    "active": resultFilterMessage && currentIndexSearch > 0
                                })} onClick={(e) => {
                                    if (currentIndexSearch > 0 && currentIndexSearch <= resultFilterMessage.length - 1) {
                                        setCurrentIndexSearch(currentIndexSearch - 1);
                                    }
                                }}>
                                    <i className='bx bxs-chevron-down fs-18'></i>
                                </div>
                                <div className="close-filter" onClick={(e) => setShowFilterMessage(false)}>
                                    <span>{t('button.close')}</span>
                                </div>
                            </div>
                        </div>}
                        <div className="chat-box-content-detail p-d-flex p-flex-column-reverse p-p-2" style={{flex: '1 1 auto'}} onScroll={(e) => CommonFunction.debounce(200, () => {
                            onMessageScroll(e)
                        })}>
                            {/*<LoadingBar loading={loadingMessage} />*/}
                            {buttonScrollBottom && <div className="p-d-flex p-flex-column p-ai-center w100 position-relative button-scroll-bottom-container" onClick={(e) => {
                                let chatLogContainer = document.getElementsByClassName('chat-box-content-detail')[0];
                                chatLogContainer.scrollTop = chatLogContainer.scrollHeight;
                            }}>
                                <div style={{position: 'fixed'}}>
                                    {!newMessageOnScroll && <i className='button-scroll-bottom bx bx-down-arrow-alt fs-26' style={{color: currentConversation.config.background}}/>}
                                    {scrollChatLog && newMessageOnScroll && newMessageOnScroll.convId === currentConversation.id && <div className="new-message p-d-flex p-ai-center">
                                        <XAvatar size="26px" className="p-pr-2" src={CommonFunction.getImageUrl(newMessageOnScroll.sender.avatar, newMessageOnScroll.sender.fullName)}></XAvatar>
                                        <div className="p-d-flex p-ai-center">
                                            <b className="text-grey p-mr-1">{newMessageOnScroll.sender.lastName}:</b>
                                            <b>{newMessageOnScroll.content}</b>
                                        </div>
                                    </div>}
                                </div>
                            </div>}
                            {userTyping && userTyping.typing && userTyping.senderId !== state.user.id && userTyping.convId === currentConversation.id && <div className="p-d-flex p-ai-center user-typing">
                                <XAvatar size="28px" src={CommonFunction.getImageUrl(userTyping.sender.avatar, userTyping.sender.fullName)}></XAvatar>
                                <div className="p-d-flex chat-box-content-detail-row p-pl-2" style={{position: 'relative', top: '0', marginBottom: '0'}}>
                                    <div className="p-d-flex p-flex-column" style={{marginBottom: '5px'}}>
                                            <span className="bg-grey-4 p-p-2" style={{borderRadius: '15px 15px 15px 15px', marginBottom: '0px', maxWidth: '400px'}}>
                                                <div className="typing-container">
                                                    <div className="typing-block">
                                                        <div className="typing-dot"></div>
                                                        <div className="typing-dot"></div>
                                                        <div className="typing-dot"></div>
                                                    </div>
                                                </div>
                                            </span>
                                    </div>
                                </div>
                            </div>}
                            {messages && messages.length > 0 && messages.map((message, index) => {
                                return (
                                    <div key={index + '_conversation'}>
                                        <p className="tiny p-text-center text-grey-7 p-my-2">{message.conversationDate}</p>
                                        {message && message.messages && message.messages.length > 0 && message.messages.map((_message, _index) => {
                                            if (_message.userId === state.user.id) {
                                                return (
                                                    <div key={_index + '_message'}>
                                                        <div className="p-d-flex p-flex-column p-pl-2 p-ai-end">
                                                            {_message.messages && _message.messages.length > 0 && _message.messages.map((mgs, i) => <XMessage mentions={mentions} regexes={regexes} message={mgs.content} messages={_message} config={currentConversation.config ? currentConversation.config : defaultConfigConversation} index={i} key={'content_' + _message.messages[i].id}
                                                                                                                                                              fromCurrentUser={true} selectMessage={(val) => setParentMessage(val)} setMessage={(val) => {
                                                                let _messages = _.cloneDeep(messages);

                                                                _messages[index].messages[_index].messages = val;

                                                                setMessages(_messages);
                                                            }}/>)}
                                                        </div>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div key={_index + '_message'} className="p-d-flex">
                                                        <XAvatar size="28px" className="p-ai-end" src={CommonFunction.getImageUrl(_message.user.avatar, _message.user.fullName)}></XAvatar>
                                                        <div className="p-d-flex p-flex-column p-pl-2">
                                                            <span className="tiny text-grey p-pl-2 p-mb-1">{_message.user.lastName}</span>
                                                            {_message.messages && _message.messages.length > 0 && _message.messages.map((mgs, i) => <XMessage mentions={mentions} regexes={regexes} message={mgs.content} messages={_message} config={currentConversation.config ? currentConversation.config : defaultConfigConversation} index={i} key={'content_' + _message.messages[i].id}
                                                                                                                                                              fromCurrentUser={false} selectMessage={(val) => setParentMessage(val)}/>)}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                )
                            })}
                            {loadingMessage && <div className="p-d-flex p-ai-center p-jc-center p-p-2">
                                <i className='bx bx-loader-circle bx-spin text-grey'></i>
                            </div>}
                        </div>
                    </>}
                    <div className={classNames({
                        "p-d-flex p-flex-column p-p-2": true,
                        "border-top": parentMessage ? true : false
                    })}>
                        {parentMessage && <div className="p-d-flex p-flex-column p-pb-2">
                            <div className="p-d-flex p-jc-between p-ai-center">
                                <span style={{fontWeight: '400'}}>{t('chat.message.reply')} <b>{parentMessage.sender.fullName}</b></span>
                                <i className="cancel-reply" onClick={(e) => setParentMessage(null)}/>
                            </div>
                            <p className="fs-12 text-grey">{parentMessage.content}</p>
                        </div>}
                        <XComments
                            sender={{
                                id: state.user.id,
                                name: state.user.fullName,
                                avatar: CommonFunction.getImageUrl(state.user.avatar, state.user.fullName)
                            }}
                            inputRef={refInputText}
                            allowFileTypes={["image", "document"]}
                            mentionTypes={[{
                                trigger: "@",
                                data: async (paging) => {
                                    let res = await UserApi.search({filter: paging.search.toLowerCase()});
                                    return {
                                        page: res.page,
                                        size: res.pageSize,
                                        total: res.total,
                                        data: res.content.map(user => ({
                                            ...user,
                                            display: `${user.lastName || ""} ${user.middleName || ""} ${user.firstName || ""}`.trim()
                                        }))
                                    }
                                },
                                renderSuggestion: (suggestion) => {
                                    return (
                                        <>
                                            <img className="suggestion-avatar" src={CommonFunction.getImageUrl(suggestion.avatar, suggestion.display)}/>
                                            <span className="suggestion-name p-ml-2">{suggestion.display}</span>
                                        </>
                                    )
                                }
                            }]}
                            allowEmoji
                            onKeyDownEvent={() => {
                                if (currentConversation) {
                                    clearTimeout(timeoutTyping);

                                    if (!onTyping) {
                                        setOnTyping(true);
                                        sendMessage(JSON.stringify({typing: true, convId: currentConversation.id}));
                                    }
                                    const timeout = setTimeout(() => {
                                        sendMessage(JSON.stringify({typing: false, convId: currentConversation.id}));
                                        setOnTyping(false);
                                    }, 1000);

                                    setTimeoutTyping(timeout);
                                }
                            }}
                            submit={async (params) => {
                                let _fileMessage = null;
                                let _message = null;
                                let _messages = [];
                                let result = null;
                                let messageId = CommonFunction.uuid();

                                // submit attachments
                                if (params.attachments && params.attachments.length > 0) {
                                    await Promise.all((function* () {
                                        for (let _attachment of params.attachments) {
                                            yield new Promise(resolve => {
                                                TaskBaseApi.createAttachments(
                                                    null,
                                                    _attachment.file,
                                                    {
                                                        application: "comm-service",
                                                        refType: "chat",
                                                        refId: messageId
                                                    }
                                                ).then(res => {
                                                    _attachment.id = res[0].file.id;
                                                    _attachment.name = res[0].file.name;
                                                    resolve("");
                                                })
                                            })
                                        }
                                    })()).then(() => {
                                        // all files uploaded
                                    })
                                }

                                let _currentConversation = _.cloneDeep(currentConversation);

                                if (!_currentConversation) {
                                    if (newMessage && conversation.users && conversation.users.length > 0) {
                                        const ids = [...conversation.users.map(user => (user.id))];

                                        _currentConversation = await ChatApi.createConversation({
                                            members: ids,
                                            name: ids.length > 1 ? 'GROUP' : 'PRIVATE',
                                            type: ids.length > 1 ? 'GROUP' : 'PRIVATE',
                                            config: {
                                                background: "rgb(0, 132, 255)",
                                                notification: "on",
                                                color: "rgb(255, 255, 255)"
                                            }
                                        });

                                        let _conversations = _.cloneDeep(conversations);

                                        _conversations = [_currentConversation, ..._conversations];

                                        setNewMessage(false);
                                        setConversation(_currentConversation);
                                        setCurrentConversation(_currentConversation);
                                        setConversations(_conversations);

                                        _message = {
                                            id: messageId,
                                            convId: _currentConversation.id,
                                            content: params.output.value
                                        };

                                        if (params.attachments && params.attachments.length > 0) {
                                            _fileMessage = _.cloneDeep({..._message, id: CommonFunction.uuid()});

                                            _fileMessage.type = 'FILE'
                                            _fileMessage.content = JSON.stringify(params.attachments.map(m => ({id: m.id, name: m.name})));
                                        }
                                        if (parentMessage) {
                                            _message.parentId = parentMessage.id;
                                        }

                                        if (params.output.value) {
                                            sendMessage(JSON.stringify(_message));

                                            _messages = [{
                                                ..._message,
                                                createDate: CommonFunction.formatDateISO8601(new Date()),
                                                senderId: state.user.id,
                                                state: 'pending'
                                            }];
                                        }

                                        if (_fileMessage) {
                                            sendMessage(JSON.stringify(_fileMessage));

                                            _messages = [{
                                                ..._fileMessage,
                                                createDate: CommonFunction.formatDateISO8601(new Date()),
                                                senderId: state.user.id,
                                                state: 'pending'
                                            }, ..._messages];
                                        }

                                        rebindMessage(_messages, currentConversation);

                                        result = buildObjectMessage(_.cloneDeep([..._messages]));

                                        setMessages(result);
                                        setRootMessages(_.cloneDeep([..._messages]));

                                        setParentMessage(null);
                                        setNewMessage(false);

                                        return true;
                                    } else {
                                        CommonFunction.toastWarning("Please select user to create new conversation");
                                        return false;
                                    }
                                } else {
                                    _message = {
                                        id: messageId,
                                        convId: _currentConversation.id,
                                        content: params.output.value
                                    };

                                    if (params.attachments && params.attachments.length > 0) {
                                        _fileMessage = _.cloneDeep({..._message, id: CommonFunction.uuid()});

                                        _fileMessage.type = 'FILE'
                                        _fileMessage.content = JSON.stringify(params.attachments.map(m => ({id: m.id, name: m.name})));
                                    }
                                    if (parentMessage) {
                                        _message.parentId = parentMessage.id;
                                    }
                                    if (params.output.value) {
                                        sendMessage(JSON.stringify(_message));

                                        _messages = [{
                                            ..._message,
                                            createDate: CommonFunction.formatDateISO8601(new Date()),
                                            senderId: state.user.id,
                                            state: 'pending'
                                        }];
                                    }
                                    if (_fileMessage) {
                                        sendMessage(JSON.stringify(_fileMessage));

                                        _messages = [{
                                            ..._fileMessage,
                                            createDate: CommonFunction.formatDateISO8601(new Date()),
                                            senderId: state.user.id,
                                            state: 'pending'
                                        }, ..._messages];
                                    }

                                    rebindMessage(_messages, currentConversation);

                                    result = buildObjectMessage(_.cloneDeep([..._messages, ...rootMessages]));

                                    setMessages(result);
                                    setRootMessages(_.cloneDeep([..._messages, ...rootMessages]));

                                    setParentMessage(null);

                                    let _conversations = _.cloneDeep(conversations);

                                    const _conversationOfMessage = _.cloneDeep(_conversations).find(_conversation => _conversation.id === currentConversation.id);

                                    _conversations = reOrderConversation(_conversations, _conversationOfMessage);

                                    setConversations(_conversations);
                                    setCurrentConversation(_currentConversation);

                                    setNewMessage(false);

                                    return true;
                                }
                            }}
                        ></XComments>
                    </div>
                </div>
                {!newMessage && currentConversation && showInformation && <div className="chat-box-information p-d-flex p-flex-column">
                    <div className="p-d-flex p-flex-column p-ai-center p-mx-auto chat-info">
                        {renderInformationConversation()}
                    </div>
                    <div className="chat-info-list-user__header position-relative p-d-flex p-flex-column p-px-2">
                        <div className="p-d-flex p-ai-center p-jc-between chat-info-list-user__header__header" onClick={(e) => {
                            setShowConversationConfig(!showConversationConfig)
                        }}>
                            <span className="text-muted fs-16">{t('chat.edit-conversation')}</span>
                            {!showConversationConfig && <i className='bx bxs-chevron-down fs-18 text-grey'></i>}
                            {showConversationConfig && <i className='bx bxs-chevron-up fs-18 text-grey'></i>}
                        </div>
                        {showConversationConfig && <div className="chat-info-list-user__header p-d-flex p-flex-column">
                            {currentConversation.type === 'GROUP' && <div className="p-d-flex p-ai-center chat-info-list-user__header__header" onClick={(e) => {
                                if (editTitleRoom) {
                                    ChatApi.updateConversation(conversation);

                                    let _conversations = _.cloneDeep(conversations);

                                    _conversations = _conversations.map(_conversation => {
                                        if (_conversation.id === conversation.id) {
                                            return {
                                                ..._conversation,
                                                name: conversation.name
                                            }
                                        }
                                        return _conversation;
                                    });

                                    setConversations(_conversations);
                                    setCurrentConversation(_conversations.find(_conversation => _conversation.id === currentConversation.id));
                                } else {
                                    setConversation(_.cloneDeep(currentConversation));
                                }
                                setEditTitleRoom(!editTitleRoom);
                            }}>
                                {editTitleRoom && <i className='bx bx-check fs-18'></i>}
                                {!editTitleRoom && <i className='bx bxs-pencil fs-18'></i>}
                                <span className="fs-14 p-text-bold text-grey-8 p-mx-2">{t('chat.conversation.edit-title')}</span>
                            </div>}
                            <div className="p-d-flex p-ai-center chat-info-config_edit-color" onClick={(e) => setShowColorPicker(true)}>
                                <i className='bx bxs-circle fs-18' style={{color: currentConversation.config.background}}></i>
                                <span className="fs-14 p-text-bold text-grey-8 p-mx-2">{t('chat.conversation.edit-color')}</span>
                            </div>
                            <div className="p-d-flex p-ai-center chat-info-config_notification" onClick={(e) => {
                                let _currentConversation = _.cloneDeep(currentConversation);

                                if (_currentConversation.config.notification === 'on') {
                                    _currentConversation.config.notification = 'off';
                                } else {
                                    _currentConversation.config.notification = 'on';
                                }

                                setCurrentConversation(_currentConversation);

                                ChatApi.updateConversation(_currentConversation).then(res => {
                                    let _conversations = _.cloneDeep(conversations);

                                    _conversations = _conversations.map(_conversation => {
                                        if (_conversation.id === _currentConversation.id) {
                                            _conversation = _currentConversation;
                                        }
                                        return _conversation;
                                    });

                                    setConversations(_conversations);
                                });
                            }}>
                                {
                                    currentConversation.config.notification === 'on' ?
                                        <React.Fragment>
                                            <i className='bx bxs-bell fs-18'></i>
                                            <span className="fs-14 p-text-bold text-grey-8 p-mx-2">{t('chat.conversation.notification.off')}</span>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            <i className='bx bxs-bell-off fs-18'></i>
                                            <span className="fs-14 p-text-bold text-grey-8 p-mx-2">{t('chat.conversation.notification.on')}</span>
                                        </React.Fragment>
                                }
                            </div>
                            <div className="p-d-flex p-ai-center chat-info-config_search" onClick={(e) => setShowFilterMessage(!showFilterMessage)}>
                                <i className='bx bx-search fs-18' />
                                <span className="fs-14 p-text-bold text-grey-8 p-mx-2">{t('chat.search-in-conversation')}</span>
                            </div>
                        </div>}
                    </div>
                    {currentConversation.type === 'GROUP' && <>
                        <div className="chat-info-list-user__header p-d-flex p-flex-column p-px-2">
                            <div className="p-d-flex p-ai-center p-jc-between chat-info-list-user__header__header" onClick={(e) => setShowDetailUser(!showDetailUser)}>
                                <span className="text-muted fs-16">{t('chat.members')}</span>
                                {!showDetailUser && <i className='bx bxs-chevron-down fs-18 text-grey'></i>}
                                {showDetailUser && <i className='bx bxs-chevron-up fs-18 text-grey'></i>}
                            </div>
                            {
                                showDetailUser && (
                                    <>
                                        {currentConversation && currentConversation.involves.filter(_involve => _involve.status === 1).length > 0 && currentConversation.involves.filter(_involve => _involve.status === 1).map((involve, index) => <Information currentConversation={currentConversation} key={'information_' + index}
                                                                                                                                                                             onChange={(newValue) => setCurrentConversation(newValue)} currentInvolve={involve}
                                                                                                                                                                             index={index} isAdmin={isAdmin}/>)}
                                        <div className="chat-info-add-member p-d-flex p-ai-center p-jc-between p-px-2" onClick={(e) => openDialogMembers()}>
                                            <div className="p-d-flex p-ai-center">
                                                <i className='bx bx-plus'/>
                                                <span className="fs-14 p-text-bold text-grey-8 p-mx-2 p-my-2">{t('chat.add-new-member')}</span>
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                        <div className="p-d-flex p-flex-column p-px-2 p-mb-2">
                            <div className="chat-info-exit-group p-d-flex p-ai-center p-jc-between p-px-2" onClick={(e) => {
                                CommonFunction.showConfirm(t('chat.conversation.exit.confirm.content'), t('chat.conversation.exit.confirm'), () => {
                                    // accept
                                    ChatApi.removeMember({
                                        convId: currentConversation.id,
                                        userId: state.user.id
                                    }).then(() => {
                                        let _conversations = _.cloneDeep(conversations);

                                        _conversations = _conversations.filter(_conversation => _conversation.id !== currentConversation.id);

                                        setCurrentConversation(_conversations[0]);

                                        setConversations(_conversations);
                                    });
                                });
                            }}>
                                <div className="p-d-flex p-ai-center">
                                    <i className='bx bx-exit'/>
                                    <span className="fs-14 p-text-bold text-grey-8 p-mx-2 p-my-2">{t('chat.conversation.exit')}</span>
                                </div>
                            </div>
                        </div>
                    </>}
                </div>}
            </XLayout>
        </Dialog>}

        {/* Choose background color */}
        {showColorPicker && <Dialog header={t('chat.config.color')}
                 visible={showColorPicker}
                 onHide={(e) => {
                     setShowColorPicker(false);

                     conversations.forEach(_conversation => {
                         if (_conversation.id === currentConversation.id) {
                             setCurrentConversation(_conversation);
                         }
                     });
                 }}
                 className="color-picker"
                 footer={
                     <>
                         <Button label={t("button.cancel")} icon="bx bx-x" className="p-button-text text-muted" onClick={(e) => {
                             setShowColorPicker(false);

                             conversations.forEach(_conversation => {
                                 if (_conversation.id === currentConversation.id) {
                                     setCurrentConversation(_conversation);
                                 }
                             });
                         }}/>
                         <Button label={t("button.save")} icon="bx bxs-save" className="" onClick={() => {
                             ChatApi.updateConversation(currentConversation).then(res => {
                                 let _conversations = _.cloneDeep(conversations);

                                 _conversations = _conversations.map(_conversation => {
                                     if (_conversation.id === currentConversation.id) {
                                         _conversation = currentConversation;
                                     }
                                     return _conversation;
                                 });

                                 setConversations(_conversations);
                                 setShowColorPicker(false);
                             })
                         }}/>
                     </>
                 }
        >
            <div className="p-d-flex p-flex-wrap p-jc-evenly">
                {colors && colors.length > 0 && colors.map((color, index) => (
                    <div key={'color_' + index}
                         onClick={(e) => {
                             let _currentConversation = _.cloneDeep(currentConversation);

                             _currentConversation.config.background = color.backgroundColor;

                             setCurrentConversation(_currentConversation);
                         }}
                         className={classNames({
                             "color-picker-item": true,
                             "selected": currentConversation && currentConversation.config.background === color.backgroundColor
                         })}
                    >
                        <div style={{backgroundColor: color.backgroundColor, backgroundImage: color.backgroundImage}} className="color-picker-item__color"></div>
                    </div>
                ))}
            </div>
        </Dialog>}

        {/* Add members into Conversation */}
        {membersBox && <Dialog header={t('chat.add-new-member')} className="wd-480-360 add-member-dialog" visible={membersBox} onHide={(e) => {
            setMembersBox(false);
            setMembers([]);
        }}>
            <div className="p-d-flex p-flex-column overflow-hidden">
                <div className="search-box p-mb-2">
                        <span className="p-input-icon-left w100">
                            <i className="bx bx-search-alt"/>
                            <InputText
                                className="w100"
                                onInput={(e) => CommonFunction.debounce(null, onFilterMemberToAdd, e.target.value)}
                                placeholder={t("search")}/>
                        </span>
                </div>
                <div className="member-list">
                    {members && members.length > 0 && members.map((member, index) => (
                        <div key={'member_' + member.id} className="member-item p-d-flex p-ai-center p-jc-between p-p-2 p-mb-1" onClick={(e) => {
                            onSelectedMemberChange(member)
                        }}>
                            <div className="p-d-flex p-ai-center">
                                <XAvatar size="32px" className="img-circle-small" src={CommonFunction.getImageUrl(member.avatar, member.fullName)}></XAvatar>
                                <span className="fs-14 p-text-bold text-grey-8 p-mx-2 p-my-1">{member.fullName}</span>
                            </div>
                            <Checkbox inputId={`member-${member.id}`} name={`member-${member.id}`} value={member} onChange={onSelectedMemberChange} checked={selectedMembers.map(selected => selected.id).indexOf(member.id) !== -1}/>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <Button label={t('chat.add-new-member')} disabled={selectedMembers.length === 0 ? true : false} className="w100 p-mt-2" onClick={(e) => addMember()}/>
            </div>
        </Dialog>}
    </React.Fragment>);
}

function XMessage({ mentions, message, messages , config, index, fromCurrentUser, selectMessage, setMessage, regexes }) {
    const { t } = useTranslation();

    const [state, dispatch] = useContext(Context);

    const [radius, setRadius] = useState("");

    const reactions = ReactionFunction.getReactions();

    const [reactioned, setReactioned] = useState(messages.messages[index].mapperReactions);
    const [preparedReactioned, setPreparedReactioned] = useState(null);
    const [totalReactioned, setTotalReactioned] = useState(null);

    const [users, setUsers] = useState([]);
    const [hasReaction, setHasReaction] = useState(null);

    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 0
    });

    const menu = useRef(null);
    const op = useRef(null);

    useEffect(() => {
        let _radius = "";

        if (messages.messages[index].parent) {
            _radius = "15px 15px 15px 15px";
        } else {
            if (fromCurrentUser) {
                if (messages.messages.length === 1) {
                    _radius = "15px 15px 15px 15px";
                } else {
                    if (index === 0) _radius = "15px 15px 0 15px";
                    else if (index === messages.messages.length - 1) _radius = "15px 0 15px 15px";
                    else _radius = "15px 0 0 15px";
                }
            } else {
                if (messages.messages.length === 1) {
                    _radius = "15px 15px 15px 15px";
                } else {
                    if (index === 0) _radius = "15px 15px 15px 0";
                    else if (index === messages.messages.length - 1) _radius = "0 15px 15px 15px";
                    else _radius = "0 15px 15px 0";
                }
            }
        }

        setRadius(_radius);
    }, [messages]);

    useEffect(() => {
        if (reactioned) {
            let _preparedReactioned = [];
            let total = 0;

            for (const key in reactioned) {
                if (key !== "userReaction") {
                    for (let i = 0; i < reactions.length; i++) {
                        const _reaction = reactions[i];
                        if (_reaction.code === key) {
                            _preparedReactioned.push({
                                type: key,
                                count: reactioned[key],
                                img: _reaction.img.s
                            })
                            break;
                        }
                    }
                    // count total
                    total += reactioned[key];
                }
            }
            if (_preparedReactioned.length > 0 && total > 0) {
                _preparedReactioned = _preparedReactioned.filter(f => f.count > 0);

                setHasReaction(reactioned['userReaction']);
                setPreparedReactioned(_preparedReactioned);
                setTotalReactioned(total);
            } else {
                setPreparedReactioned(null);
            }
        } else {
            setPreparedReactioned(null);
        }
    }, [reactioned]);

    useEffect(() => {
        loadUserReactions();
    }, [preparedReactioned]);

    const loadUserReactions = (_lazyParams = lazyParams) => {
        if (preparedReactioned) {
            let _users = [];
            preparedReactioned.forEach(async (reactioned) => {
                const data = await ChatApi.getReactionByType(messages.messages[index].id, { ..._lazyParams, type: reactioned.type });

                if (data) {
                    if (_users && _users.length > 0) {
                        _users = _users.concat(data);
                    } else {
                        _users = data;
                    }

                    setUsers(_users);
                }
            });
        }
    }

    const onReaction = (reactionCode) => {
        // prepare reaction summary
        // ---------------------------------
        let _preparedReactioned = _.cloneDeep(preparedReactioned);

        if (_preparedReactioned) {
            let found = false; // check if reactionCode is in reaction summary
            for (let i = 0; i < _preparedReactioned.length; i++) {
                // remove previous reaction
                if (hasReaction && _preparedReactioned[i].type === hasReaction) {
                    _preparedReactioned[i].count -= 1;
                }
                // apply new reaction
                if (reactionCode && _preparedReactioned[i].type === reactionCode) {
                    _preparedReactioned[i].count += 1;
                    found = true;
                }
            }

            // if reaction not found in reaction summary
            if (reactionCode && !found) {
                for (let i = 0; i < reactions.length; i++) {
                    const _reaction = reactions[i];
                    if (_reaction.code === reactionCode) {
                        _preparedReactioned.push({
                            type: reactionCode,
                            count: 1,
                            img: _reaction.img.s
                        })
                        break;
                    }
                }
            }

            // filter 0 reaction count
            _preparedReactioned = _preparedReactioned.filter(f => f.count > 0);
        } else {
            _preparedReactioned = [];

            for (let i = 0; i < reactions.length; i++) {
                const _reaction = reactions[i];
                if (_reaction.code === reactionCode) {
                    _preparedReactioned.push({
                        type: reactionCode,
                        count: 1,
                        img: _reaction.img.s
                    })
                    break;
                }
            }

            let _users = _.cloneDeep(users);

            _users.push({
                userId: state.user
            });

            setUsers(_users);
        }

        setPreparedReactioned(_preparedReactioned);

        const _userReactions = _.cloneDeep(messages.messages[index].userReactions ? messages.messages[index].userReactions : []);
        const _hasReaction = _userReactions.filter(_userReaction => _userReaction.id === state.user.id).length > 0 ? true : false;

        if (!_hasReaction) {
            _userReactions.push({
                id: state.user.id,
                fullName: state.user.fullName
            });
        }

        messages.messages[index].userReactions = _userReactions;

        let total = 0;
        _preparedReactioned.forEach(el => {
            total += el.count;
        });
        setTotalReactioned(total);

        // submit reaction
        // ---------------------------------
        if (reactionCode) {
            ChatApi.reaction(messages.messages[index].id, reactionCode).then(() => {
                setHasReaction(reactionCode);
            });
        } else {
            NewsFeedApi.removeReaction(messages.messages[index].id).then(() => {
                setHasReaction(reactionCode);
            });
        }
    }

    const userReaction = (reaction) => {
        const _users = users.filter(user => user.type === reaction.type);

        return (<XLayout>
            <XLayout_Center style={{ height: 'fit-content', maxHeight: '200px' }} onScroll={(e) => CommonFunction.debounce(200, () => { onScroll(e) })}>
                {_users && _users.map((user, index) => (
                    <div key={index} className="p-d-flex">
                        <XAvatar size="32px" src={CommonFunction.getImageUrl(user.userId.avatar, user.userId.fullName)}></XAvatar>
                        <div className="p-d-flex p-flex-column p-mx-2 p-my-1 p-jc-center">
                            <UserPopover
                                user={{
                                    id: user.userId.id,
                                    fullName: user.userId.fullName
                                }}
                                title={() => (<span className="fs-14 p-text-bold text-blue-8">{user.userId.fullName}</span>)}
                            ></UserPopover>
                        </div>
                    </div>
                ))}
            </XLayout_Center>
        </XLayout>)
    }

    /**
     * event khi scroll feeds
     * @param {*} e
     */
    const onScroll = (e) => {
        // load tiếp dữ liệu khi scroll xuống vị trí cách bottom 50px
        if (e.target.scrollHeight - 50 < e.target.scrollTop + e.target.clientHeight) {
            loadUserReactions({ ...lazyParams, rows: lazyParams.rows + 10 });
        }
    }

    const headerTemplate = (reaction, index) => {
        return <div key={index} className="p-d-flex p-ai-center">
            <img key={index} src={reaction.img} />
            <span className="p-ml-1">{reaction.count}</span>
        </div>
    }

    /**
     * render message part
     */
    const renderMessagePart = (part) => {
        let _mentions = regexes.current;
        switch (part.type) {
            case "mention":
                // render mention part
                if (_mentions[part.mentionIndex].renderer && typeof _mentions[part.mentionIndex].renderer === "function") {
                    return _mentions[part.mentionIndex].renderer(part);
                } else {
                    return <span className="x-message-message-mention">{part.value}</span>
                }
                break;
            default:
                // default return plain text
                return <span dangerouslySetInnerHTML={{ __html: CommonFunction.removeScriptTags(part.content) }}></span>
                break;
        }
    }

    if (fromCurrentUser) {
        // only one: borderRadius: 15px 15px 15px 15px
        // first: borderRadius: 15px 15px 0 15px
        // center: borderRadius: 15px 0 0 15px
        // last: borderRadius: 15px 0 15px 15px
        return (
            <div className="p-d-flex p-flex-column" id={'content_' + messages.messages[index].id}>
                {messages.messages[index].parent && <div className="p-d-flex p-jc-end p-ai-center p-mb-1">
                    <i className="bx bxs-share text-grey fs-14 p-pr-2"/>
                    {messages.messages[index].parent.sender.id !== state.user.id ?
                        <span className="text-grey fs-12">{t('chat.message.replied')} {messages.messages[index].parent.sender.lastName}</span>
                        :
                        <span className="text-grey fs-12">{t('chat.message.replied-to-yourself')}</span>
                    }
                </div>}
                {messages.messages[index].parent && <div className="p-d-flex p-jc-end p-ai-center chat-box-content-detail-row-parent">
                    <span className="message-content" style={{ borderRadius: '15px 15px 15px 15px', maxWidth: '400px', padding: '0.5rem 0.5rem 1rem 0.5rem', color: '#65676b', background: '#f6f9fa' }}>{messages.messages[index].parent.content}</span>
                </div>}
                <div className="p-d-flex p-jc-end chat-box-content-detail-row" style={{ position: 'relative', top: messages.messages[index].parent ? '-12px' : '0', marginBottom: preparedReactioned || (messages.messages[index].type === 'FILE' && JSON.parse(message) && JSON.parse(message).length === 0) && index < messages.messages.length - 1 ? '1.25rem' : '0' }}>
                    <div className="actions-message p-d-flex p-ai-center p-pr-2">
                        <Menu model={[
                            {
                                label: <b>{t('chat.message.delete')}</b>,
                                command: () => {
                                    ChatApi.removeMessage(messages.messages[index].id).then(() => {
                                        let _messages = _.cloneDeep(messages.messages);

                                        _messages = _messages.filter(_message => _message.id.indexOf(messages.messages[index].id));

                                        setMessage(_messages);
                                    });
                                }
                            }
                        ]} popup ref={menu} id={`popup_menu_${messages.messages[index].id}_${index}`} />
                        <i className='bx bx-dots-vertical-rounded view-more text-grey fs-18 p-px-1' onClick={(event) => menu.current.toggle(event)} aria-controls={`popup_menu_${messages.messages[index].id}_${index}`} aria-haspopup />
                        <Tooltip target=".view-more" content={t('chat.message.view-more')} position="top" />

                        <i className='bx bxs-share message-reply text-grey fs-18 p-px-1' onClick={(e) => selectMessage(messages.messages[index])} />
                        <Tooltip target=".message-reply" content={t('chat.message.message-reply')} position="top" />

                        <XReactionMessage onReaction={onReaction} />
                    </div>
                    {/*{JSON.stringify(messages.messages[index])}*/}
                    {messages.messages[index].type === 'TEXT' && <span className="p-p-2 message-content" title={CommonFunction.formatDate(new Date(messages.messages[index].createDate), 'HH:mm, DD MMMM, YYYY')} style={{borderRadius: radius, marginBottom: '2px', maxWidth: '400px', background: config.background, color: config.color}}>{messages.messages[index].preparedContent && messages.messages[index].preparedContent.length > 0 && messages.messages[index].preparedContent.map((part, partIndex) => (
                        <React.Fragment key={partIndex}>
                            {renderMessagePart(part)}
                        </React.Fragment>
                    ))}</span>}
                    {messages.messages[index].type === 'FILE' && JSON.parse(message) && <div className="p-d-flex p-flex-column" style={{ marginBottom: '5px' }}>
                        {/*<div className="p-d-flex p-jc-end">*/}
                        {/*    <span className="p-p-2 message-content" title={CommonFunction.formatDate(new Date(messages.messages[index].createDate), 'HH:mm, DD MMMM, YYYY')} style={{borderRadius: '15px 15px 0 15px', marginBottom: preparedReactioned ? '15px' : '0px', maxWidth: '400px', background: config.background, color: config.color}}>{message}</span>*/}
                        {/*</div>*/}
                        {/*<XFilePreviewList className="p-jc-end" files={messages.messages[index].attachments}></XFilePreviewList>*/}
                        <XFilePreviewList files={JSON.parse(message)}></XFilePreviewList>
                    </div>}
                    <div className="p-pl-1 p-d-flex p-flex-column p-jc-end" style={{ marginBottom: '2px' }}>
                        <i className={classNames({
                            'bx bx-check-circle text-grey': messages.messages[index].state === 'pending',
                            'bx bxs-check-circle': messages.messages[index].state === 'done'
                        })} style={{ color: index === messages.messages.length - 1 ? config.background : '#ffffff' }} />
                    </div>
                    {preparedReactioned && <div className="p-d-flex p-flex-column">
                        <div className="message-summary-reactions-right">
                            <Tooltip target={`#reaction_${messages.messages[index].id}`} autoHide={false} position="top">
                                <div className="p-d-flex p-flex-column">
                                    {messages.messages[index].userReactions && messages.messages[index].userReactions.length > 0 && messages.messages[index].userReactions.map((userReaction, i) => (
                                        <p key={'user_' + messages.messages[index].id}>{userReaction.fullName}</p>
                                    ))}
                                </div>
                            </Tooltip>
                            <div id={'reaction_' + messages.messages[index].id} className="message-summary-reactions-container-right" onClick={(e) => {
                                if (users && users.length > 0) {
                                    op.current.toggle(e);
                                }
                            }}>
                                {preparedReactioned.map((reaction, index) => (
                                    <img key={index} src={reaction.img}/>
                                ))}
                                <span className="p-text-bold p-px-1 fs-12 text-grey">{totalReactioned}</span>
                            </div>
                            {users && users.length > 0 && <OverlayPanel ref={op} style={{width: 'fit-content'}}>
                                <TabView>
                                    <TabPanel header={t('reaction.all')}>
                                        <XLayout>
                                            <XLayout_Center style={{height: 'fit-content', maxHeight: '200px'}} onScroll={(e) => CommonFunction.debounce(200, () => {
                                                onScroll(e)
                                            })}>
                                                {users && users.map((user, index) => (
                                                    <div key={index} className="p-d-flex p-my-1">
                                                        <XAvatar size="32px" src={CommonFunction.getImageUrl(user.userId.avatar, user.userId.fullName)}></XAvatar>
                                                        <div className="p-d-flex p-flex-column p-mx-2 p-my-1 p-jc-center">
                                                            <UserPopover
                                                                user={{
                                                                    id: user.userId.id,
                                                                    fullName: user.userId.fullName
                                                                }}
                                                                title={() => (<span className="fs-14 p-text-bold text-blue-8">{user.userId.fullName}</span>)}
                                                            ></UserPopover>
                                                        </div>
                                                    </div>
                                                ))}
                                            </XLayout_Center>
                                        </XLayout>
                                    </TabPanel>
                                    {preparedReactioned.map((reaction, index) => (
                                        <TabPanel key={index} header={headerTemplate(reaction, index)}>
                                            {userReaction(reaction)}
                                        </TabPanel>
                                    ))}

                                </TabView>
                            </OverlayPanel>}
                        </div>
                    </div>}
                </div>
            </div>
        )
    } else {
        // only one: borderRadius: 15px 15px 15px 15px
        // first: borderRadius: 15px 15px 15px 0
        // center: borderRadius: 0 15px 15px 0
        // last: borderRadius: 0 15px 15px 15px
        return (
            <div className="p-d-flex p-flex-column" id={'content_' + messages.messages[index].id}>
                {messages.messages[index].parent && <div className="p-d-flex p-jc-start p-ai-center p-mb-1">
                    {/*{JSON.stringify(messages.messages[index])}*/}
                    <i className="bx bxs-share text-grey fs-14 p-pr-2"/>
                    {messages.messages[index].parent.sender.id !== state.user.id ?
                        messages.messages[index].sender.id === messages.messages[index].parent.sender.id ?
                            <span className="text-grey fs-12">{messages.messages[index].sender.lastName} {t('chat.message.user.replied-to-yourself')}</span>
                            :
                            <span className="text-grey fs-12">{messages.messages[index].sender.lastName} {t('chat.message.user.replied.other')} {messages.messages[index].parent.sender.lastName}</span>
                        :
                        <span className="text-grey fs-12">{messages.messages[index].sender.lastName} {t('chat.message.user.replied')}</span>
                    }
                </div>}
                {messages.messages[index].parent && <div className="p-d-flex p-jc-start p-ai-center chat-box-content-detail-row-parent">
                    <span className="message-content" style={{ borderRadius: '15px 15px 15px 15px', maxWidth: '400px', padding: '0.5rem 0.5rem 1rem 0.5rem', color: '#65676b', background: '#f6f9fa' }}>{messages.messages[index].parent.content}</span>
                </div>}
                <div className="p-d-flex chat-box-content-detail-row" style={{ position: 'relative', top: messages.messages[index].parent ? '-12px' : '0',  marginBottom: preparedReactioned || (messages.messages[index].type === 'FILE' && JSON.parse(message) && JSON.parse(message).length === 0) && index < messages.messages.length - 1 ? '1.25rem' : '0' }}>
                    {preparedReactioned && <div className="p-d-flex p-flex-column">
                        <div className="message-summary-reactions-left">
                            <Tooltip target={`#reaction_${messages.messages[index].id}`} autoHide={false} position="top">
                                {messages.messages[index].userReactions && messages.messages[index].userReactions.length > 0 && messages.messages[index].userReactions.map((userReaction, i) => (
                                    <p key={'user_' + messages.messages[index].id}>{userReaction.fullName}</p>
                                ))}
                            </Tooltip>
                            <div id={'reaction_' + messages.messages[index].id} className="message-summary-reactions-container-left" onClick={(e) => {
                                if (users && users.length > 0) {
                                    op.current.toggle(e);
                                }
                            }}>
                                {preparedReactioned.map((reaction, index) => (
                                    <img key={index} src={reaction.img}/>
                                ))}
                                <span className="p-text-bold p-px-1 fs-12 text-grey">{totalReactioned}</span>
                            </div>
                            {users && users.length > 0 && <OverlayPanel ref={op} style={{width: 'fit-content'}}>
                                <TabView>
                                    <TabPanel header={t('reaction.all')}>
                                        <XLayout>
                                            <XLayout_Center style={{height: 'fit-content', maxHeight: '200px'}} onScroll={(e) => CommonFunction.debounce(200, () => {
                                                onScroll(e)
                                            })}>
                                                {users && users.map((user, index) => (
                                                    <div key={index} className="p-d-flex p-my-1">
                                                        <XAvatar size="32px" src={CommonFunction.getImageUrl(user.userId.avatar, user.userId.fullName)}></XAvatar>
                                                        <div className="p-d-flex p-flex-column p-mx-2 p-my-1 p-jc-center">
                                                            <UserPopover
                                                                user={{
                                                                    id: user.userId.id,
                                                                    fullName: user.userId.fullName
                                                                }}
                                                                title={() => (<span className="fs-14 p-text-bold text-blue-8">{user.userId.fullName}</span>)}
                                                            ></UserPopover>
                                                        </div>
                                                    </div>
                                                ))}
                                            </XLayout_Center>
                                        </XLayout>
                                    </TabPanel>
                                    {preparedReactioned.map((reaction, index) => (
                                        <TabPanel key={index} header={headerTemplate(reaction, index)}>
                                            {userReaction(reaction)}
                                        </TabPanel>
                                    ))}

                                </TabView>
                            </OverlayPanel>}
                        </div>
                    </div>}
                    {messages.messages[index].type === 'TEXT' && <span title={CommonFunction.formatDate(new Date(messages.messages[index].createDate), 'HH:mm, DD MMMM, YYYY')} className="bg-grey-4 p-p-2 message-content" style={{borderRadius: radius, marginBottom: '2px', maxWidth: '400px'}}>{messages.messages[index].preparedContent && messages.messages[index].preparedContent.length > 0 && messages.messages[index].preparedContent.map((part, partIndex) => (
                        <React.Fragment key={partIndex}>
                            {renderMessagePart(part)}
                        </React.Fragment>
                    ))}</span>}
                    {messages.messages[index].type === 'FILE' && JSON.parse(message) && <div className="p-d-flex p-flex-column" style={{ marginBottom: '5px' }}>
                        {/*<span title={CommonFunction.formatDate(new Date(messages.messages[index].createDate), 'HH:mm, DD MMMM, YYYY')} className="bg-grey-4 p-p-2 message-content" style={{borderRadius: '15px 15px 15px 0', marginBottom: preparedReactioned ? '15px' : '0px', maxWidth: '400px'}}>{message}</span>*/}
                        {/*<XFilePreviewList files={messages.messages[index].attachments}></XFilePreviewList>*/}
                        <XFilePreviewList files={JSON.parse(message)}></XFilePreviewList>
                    </div>}
                    <div className="actions-message p-d-flex p-ai-center p-pl-2">
                        <XReactionMessage onReaction={onReaction} />
                        {/*<i className="bx bx-smile text-grey fs-18 p-px-1" />*/}

                        <i className='bx bxs-share text-grey fs-18 p-px-1 message-reply' onClick={(e) => selectMessage(messages.messages[index])} />
                        <Tooltip target=".message-reply" content={t('chat.message.message-reply')} position="top" />

                        {/*<i className='bx bx-dots-vertical-rounded text-grey fs-18 p-px-1' />*/}
                    </div>
                </div>
            </div>
        )
    }
}

function XReactionMessage({ onReaction, hasReaction }) {
    const reactions = ReactionFunction.getReactions();

    /**
     * event on reaction click
     * @param {*} reaction
     */
    const reactionClick = (reaction) => {
        if (onReaction && typeof onReaction === "function") {
            onReaction(reaction.code);
        }
    }

    return (
        <XPopover
            title={() => (
                <i className="bx bx-smile message-reaction text-grey fs-18 p-px-1" />
            )}
            position="top"
            width={286}
            content={() => (
                <div className="x-reaction-popover">
                    {reactions.map((reaction, index) => (
                        <img key={index} src={reaction.img.l} title={reaction.label} onClick={() => reactionClick(reaction)} />
                    ))}
                </div>
            )}
        />
    );
}

function Information({ onChange, currentConversation, currentInvolve, index, isAdmin }) {
    const { t } = useTranslation();

    const [state, dispatch] = useContext(Context);

    const menu = useRef(null);

    const [involve, setInvolve] = useState(currentInvolve);

    useEffect(() => {
        setInvolve(currentInvolve);
    }, [currentInvolve])

    if (!involve) {
        return <></>
    }
    else if (isAdmin && involve) {
        return (
            <div className="p-d-flex p-ai-center p-jc-between p-mx-2 p-py-2">
                <div className="p-d-flex">
                    <XAvatar size="32px" className="img-circle-small" src={CommonFunction.getImageUrl(involve.userDTO.avatar, involve.userDTO.fullName)}></XAvatar>
                    <div className="p-d-flex p-flex-column p-mx-2 p-my-1 p-jc-center">
                        <span className="fs-14 p-text-bold text-grey-8">{involve.userDTO.fullName}</span>
                        <i className="tiny text-grey-8">{t(`chat.role.${involve.role}`)}</i>
                    </div>
                </div>
                <div>
                    <Menu model={[
                        {
                            label: involve.role === 'MEMBER' ? t('chat.message.grant-admin') : t('chat.message.revoke-admin'),
                            command: () => {
                                if (involve.role === 'MEMBER') {
                                    ChatApi.grantAdmin({
                                        convId: involve.convId,
                                        involves: {
                                            "ADMIN": [involve.userDTO.id]
                                        }
                                    }).then(() => {
                                        let _involve = _.cloneDeep(involve);

                                        _involve.role = "ADMIN";

                                        currentConversation.involves[index] = _involve;
                                        setInvolve(_involve);
                                        onChange(currentConversation);
                                    })
                                } else {
                                    ChatApi.revokeAdmin({
                                        convId: involve.convId,
                                        userId: involve.userDTO.id
                                    }).then(() => {
                                        let _involve = _.cloneDeep(involve);

                                        _involve.role = "MEMBER";

                                        currentConversation.involves[index] = _involve;
                                        setInvolve(_involve);
                                        onChange(currentConversation);
                                    })
                                }
                            }
                        },
                        {
                            label: state.user.id === involve.userDTO.id ? t('chat.message.leave') : t('chat.message.delete-member'),
                            command: () => {
                                ChatApi.removeMember({
                                    convId: involve.convId,
                                    userId: involve.userDTO.id
                                }).then(() => {
                                    currentConversation.involves = currentConversation.involves.filter(_involve => involve.userDTO.id.indexOf(_involve.userDTO.id) === -1);
                                    onChange(currentConversation);
                                    setInvolve(null);
                                })
                            }
                        }
                    ]} popup ref={menu} id={`popup_menu_${involve.convId}_${index}`} />
                    <i className='bx bx-dots-horizontal-rounded' onClick={(event) => menu.current.toggle(event)} aria-controls={`popup_menu_${involve.convId}_${index}`} aria-haspopup />
                </div>
            </div>
        )
    } else {
        return (
            <div className="p-d-flex p-ai-center p-jc-between p-mx-2 p-py-2">
                <div className="p-d-flex">
                    <XAvatar size="32px" className="img-circle-small" src={CommonFunction.getImageUrl(involve.userDTO.avatar, involve.userDTO.fullName)}></XAvatar>
                    <div className="p-d-flex p-flex-column p-mx-2 p-my-1 p-jc-center">
                        <span className="fs-14 p-text-bold text-grey-8">{involve.userDTO.fullName}</span>
                        <i className="tiny text-grey-8">{t(`chat.role.${involve.role}`)}</i>
                    </div>
                </div>
            </div>
        )
    }
}
