import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from 'react-redux';
import React from 'react';
import Navbar from 'scenes/navbar';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import ChatContainer from 'components/ChatContainer';
import GroupChat from 'components/GroupChat';


const Chat = () => {
    const theme = useTheme()
    const { _id } = useSelector((state) => state.user);
    /*  const _id = user ? user._id : null; */

    return (
        <>
            <Navbar />
            <Box
                display='flex'
                justifyContent='center'
                alignItems='flex-start'
            >
                <WidgetWrapper
                    width='80%'
                    my={'1.2rem'}
                    height='85vh'
                >
                    <FlexBetween width='100%' height='100%' gap='1rem'>
                        <Box display={'flex'}
                            justifyContent='flex-start'
                            height='100%'
                            flexDirection={'column'}
                        >
                            {/*      <GroupChat /> */}
                            <FriendListWidget
                                bgcolor={theme.palette.background.default} userId={_id}
                                isChat={true}

                            />
                        </Box>

                        <Box
                            width='100%'
                            height='100%'
                            bgcolor={theme.palette.background.default}

                            display='flex'
                            alignItems='stretch'
                        >

                            <ChatContainer />

                        </Box>
                    </FlexBetween>
                </WidgetWrapper>

            </Box>




        </>
    );
}

export default Chat;