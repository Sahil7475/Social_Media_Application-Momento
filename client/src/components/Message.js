import { Box, useTheme } from '@mui/material';
import React from 'react';
import FlexBetween from './FlexBetween';
import { useSelector } from 'react-redux';
import ScrollableFeed from 'react-scrollable-feed'

const Message = ({ messages }) => {
    const userEmail = useSelector((state) => state.user.email)
    const theme = useTheme();
    const primaryLight = theme.palette.primary.light;
    const primaryMain = theme.palette.primary.main;
    return (
        <Box style={{ width: '100%', height: '470px' }}>
            <ScrollableFeed className='scrollable-feed' color={'white'} width='100%'>
                <Box width='100%'>
                    {messages && messages.map((message) => (
                        <FlexBetween key={message.id}>
                            {message.sender.email === userEmail ? (
                                <Box
                                    sx={{
                                        padding: '1rem',
                                        textAlign: 'center',
                                        alignItems: 'start',
                                        borderRadius: '10px',
                                        marginY: '1rem',
                                        marginLeft: 'auto'
                                    }}
                                    bgcolor={primaryLight}>{message.content}</Box>) :
                                <Box sx={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    alignItems: 'end',
                                    borderRadius: '10px',
                                    marginY: '1rem',
                                    marginRight: 'auto',
                                }}
                                    bgcolor={primaryMain}>{message.content}</Box>
                            }
                        </FlexBetween>
                    ))}
                </Box>

            </ScrollableFeed>
        </Box>

    );
}

export default Message;