import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material'
import { EmojiEmotionsOutlined } from '@mui/icons-material';
import FlexBetween from './FlexBetween';
import SendIcon from '@mui/icons-material/Send';
import Picker from "emoji-picker-react";
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
const ENDPOINT = 'http://localhost:3001';
var socket, selectedChatCompare;

const ChatInput = ({ fetchMessages }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [newmessage, setNewMessage] = useState('');
    const { _id } = useSelector((state) => state.user);
    const [socketConnected, setSocketConnected] = useState(false);
    const token = useSelector((state) => state.token);
    const selectedChat = useSelector((state) => state.selectedChat);
    const [typing, setTyping] = useState(false);
    const [Istyping, setIsTyping] = useState(false);



    const onEmojiClick = (event, emojiObject) => {
        // setNewMessage(newmessage + emojiObject.emoji);
    };

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };
    useEffect(() => {
        socket = socket || io(ENDPOINT);

        socket.emit("setup", _id);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => {
            console.log('true');
            setIsTyping(true)
        });
        socket.on("stop typing", () => setIsTyping(false));

        // eslint-disable-next-line
    }, []);
    const sendMessage = async () => {
        socket.emit("stop typing", selectedChat._id);
        try {
            const response = await fetch(`http://localhost:3001/message`, {
                method: "POST",
                body: JSON.stringify({
                    sender: _id,
                    content: newmessage,
                    chatId: selectedChat._id
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();

            setNewMessage(data)
            socket.emit("new message", data);
            fetchMessages()

            setNewMessage('')

        } catch (error) {
            console.log("error on send message")
        }
    }
    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };
    return (

        <Box
            position='relative'
            width='100%' alignItems='center' padding='.3rem'>
            {Istyping ? (<div color='white'>Typing...</div>) : (<></>)}
            <Box
                position='absolute'
                bottom={50}
                left={0}
            >
                {showEmojiPicker && <Picker theme='dark' emojiStyle='facebook'
                    onEmojiClick={onEmojiClick} disableAutoFocus={true} native />}
            </Box>
            <form sx={{
                width: '100%'
            }}

            >
                <FlexBetween gap='2rem' height='100%' >

                    <IconButton onClick={handleEmojiPickerhideShow} >
                        <EmojiEmotionsOutlined />
                    </IconButton>

                    <TextField
                        id="filled-basic"
                        label="Type Your messege.."
                        variant="filled"
                        onChange={typingHandler}
                        value={newmessage}
                        sx={{
                            width: '100%',
                            fontSize: '1rem',
                        }}
                    />
                    <Button onClick={sendMessage} >
                        <SendIcon />
                    </Button>

                </FlexBetween>
            </form>
        </Box>

    );
}

export default ChatInput;