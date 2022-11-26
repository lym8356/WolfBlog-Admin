import { AccountCircle, HomeOutlined, LogoutOutlined, Person } from "@mui/icons-material";
import { AppBar, Box, Fade, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useSelector } from "../../redux/hooks";
import { logOut } from "../../redux/slices/accountSlice";


const Header: React.FC = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.account);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
    const handleLogout = async () => {
        try {
            await dispatch(logOut());
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <AppBar
            position="static"
            sx={{
                width: '100%'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'end',
                }}
            >
                <IconButton size="large">
                    <HomeOutlined fontSize="large" color="secondary" />
                </IconButton>
                <IconButton size="large" onClick={handleClick}>
                    <AccountCircle fontSize="large" color="secondary" />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Person />
                        </ListItemIcon>
                        <ListItemText>
                            Profile
                        </ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutOutlined />
                        </ListItemIcon>
                        <ListItemText>
                            Logout
                        </ListItemText>
                    </MenuItem>
                </Menu>
            </Box>
        </AppBar >
    )
}


export default Header;