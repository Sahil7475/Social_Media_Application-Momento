import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setNotification } from 'state';
import { useParams } from "react-router-dom";
import WidgetWrapper from './WidgetWrapper';
import UserWidget from 'scenes/widgets/UserWidget';
import FlexBetween from './FlexBetween';
import UserImage from './UserImage';
import ChatInput from './ChatInput';
import Message from './Message';
import GroupChat from './GroupChat';
import { io } from 'socket.io-client';
const ENDPOINT = 'http://localhost:3001';
var socket, selectedChatCompare;


const ChatContainer = () => {
    const [user, setUser] = useState(null);
    const theme = useTheme()
    const token = useSelector((state) => state.token);
    const activeFriend = useSelector((state) => state.activeFriend);
    const selectedChat = useSelector((state) => state.selectedChat);
    const { _id } = useSelector((state) => state.user);
    const [messages, setMessages] = useState('');
    const [loading, setLoading] = useState(true);
    const [socketConnected, setSocketConnected] = useState(false);
    const notification = useSelector((state) => state.notification);
    const dispatch = useDispatch();
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", _id);
        socket.on("connected", () => {
            console.log("Connected Socket in Chat container")
            setSocketConnected(true)
        }

        );

    }, []);



    const getUser = async () => {
        const response = await fetch(`http://localhost:3001/users/${activeFriend}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
    };

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            console.log("Im there");
            if (
                !selectedChatCompare || // if chat is not selected or doesn't match current chat
                selectedChatCompare._id !== newMessageRecieved.chat._id
            ) {
                if (!notification.includes(newMessageRecieved)) {

                    dispatch(setNotification([newMessageRecieved, ...notification]));
                    /*  setFetchAgain(!fetchAgain); */
                    //        fetchMessages();
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            setLoading(true);

            const response = await fetch(`http://localhost:3001/message/${selectedChat._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);

        } catch (error) {
            console.log("error on feating msg")
        }
    };

    useEffect(() => {
        getUser();
    }, [activeFriend]);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);// eslint-disable-line react-hooks/exhaustive-deps



    console.log(notification);
    return (
        <FlexBetween flexDirection='column' width='100%' mx='1rem' my='1rem' >
            <Box width='100%'
                sx={{
                    backgroundColor: theme.palette.background.alt,
                    borderRadius: "0.75rem",
                    padding: '.3rem'
                }} >
                {user && (<Box
                    display='flex'
                    gap='2rem'
                    alignItems='center'

                >
                    <UserImage size='60px' image={user.picturePath}></UserImage>
                    <Typography

                        fontSize='1rem'
                    >
                        {user.firstName} {user.lastName}
                    </Typography>
                </Box>)}
            </Box>
            <Message messages={messages} />
            <Box width='100%'
                sx={{
                    backgroundColor: theme.palette.background.alt,
                    borderRadius: "0.75rem",
                    padding: '.3rem'
                }}
            >
                <ChatInput fetchMessages={fetchMessages} />
            </Box>

        </FlexBetween>

    );
}

export default ChatContainer;