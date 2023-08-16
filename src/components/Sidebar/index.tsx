import { Article, Feed, Home, Image, Info, Message, PendingActions, Work } from "@mui/icons-material"
import { Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material"
import { Box } from "@mui/system";
import { useLocation, useNavigate } from "react-router-dom";

const sidebarItems = [
    {
        id: 0,
        icon: <Home fontSize="large" color="secondary" />,
        label: 'Home',
        route: '/',
    },
    {
        id: 1,
        icon: <Article fontSize="large" color="secondary" />,
        label: 'Article',
        route: '/articles',
    },
    {
        id: 2,
        icon: <Image fontSize="large" color="secondary" />,
        label: 'Album',
        route: '/albums',
    },
    {
        id: 3,
        icon: <Work fontSize="large" color="secondary" />,
        label: 'Project',
        route: '/projects',
    },
    {
        id: 4,
        icon: <PendingActions fontSize="large" color="secondary" />,
        label: 'Site Log',
        route: '/sitelogs',
    },
    {
        id: 5,
        icon: <Message fontSize="large" color="secondary" />,
        label: 'Comment',
        route: '/comments',
    },
    {
        id: 6,
        icon: <Info fontSize="large" color="secondary" />,
        label: 'About',
        route: '/about',
    },
    {
        id: 7,
        icon: <Feed fontSize="large" color="secondary" />,
        label: 'Draft',
        route: '/drafts',
    },
]

export const Sidebar: React.FC = () => {

    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <Drawer
            sx={{
                '& .MuiDrawer-paper': {
                    width: "240px",
                    // width: "13.5vw",
                    backgroundColor: '#404040'
                }
            }}
            variant="permanent"
            anchor="left"
        >
            <Toolbar
                sx={{
                    height: "100px"
                }}
            >
                <Box 
                    component="img"
                    src={process.env.PUBLIC_URL + "/assets/logo.png"}
                    sx={{
                        maxHeight: "80px",
                        maxWidth: "80px"
                    }}
                />
                <Box sx={{ marginLeft: 3 }}>
                    
                    <Typography variant="h5" color="gold" >
                        WolfyBlog
                    </Typography>
                </Box>
            </Toolbar>
            <Divider sx={{ bgcolor: "secondary.light" }} />
            <List
                sx={{
                    paddingTop: 0
                }}
            >
                {sidebarItems.map((item, index) => (
                    <ListItemButton
                        selected={item.route === pathname}
                        key={item.id}
                        onClick={() => navigate(item.route)}
                        sx={{
                            ':hover': {
                                backgroundColor: 'primary.main',
                            },
                            '&.Mui-selected': {
                                backgroundColor: 'primary.main',
                                ':hover': {
                                    backgroundColor: 'primary.main'
                                }
                            }
                        }}
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.label}
                            sx={{
                                color: "#FFD700"
                            }}
                            primaryTypographyProps={{fontSize: '1.2rem'}}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
};