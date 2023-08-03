import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import Friend from './Friend';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
        width: '500px'
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const GroupChat = () => {
    const [open, setOpen] = useState(false);
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.token);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            console.log('No search')
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/users?search=${search}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            console.log("error")
        }
    };
    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            console.log('error on handle Group')
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    };



    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Create Group
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Create Group
                </BootstrapDialogTitle>
                <DialogContent dividers sx={{
                    width: '100%'
                }}>
                    <FormControl fullWidth>
                        <TextField placeholder='Chat Name'
                            sx={{
                                marginBottom: '0.5rem',
                                width: '100%'
                            }}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        ></TextField>
                        <TextField placeholder='Search user'
                            sx={{
                                marginBottom: '0.5rem',
                                width: '100%'
                            }}
                            onChange={(e) => handleSearch(e.target.value)}
                        ></TextField>
                    </FormControl>
                    {searchResult.map((friend) =>

                        <Friend
                            key={friend._id}
                            friendId={friend._id}
                            name={`${friend.firstName} ${friend.lastName}`}
                            subtitle={friend.occupation}
                            userPicturePath={friend.picturePath}
                            isChat={true}
                            isSearch={false}
                            isGroupChat={true}

                        />

                    )}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Create
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}



export default GroupChat;