import { Delete, Info } from "@mui/icons-material"
import { Box, Button, Card, CardContent, CardHeader, IconButton, List, ListItem, ListItemText, TextField, Tooltip } from "@mui/material"

export const TagBox: React.FC = () => {
    return (
        <Card
            sx={{
                ':hover': {
                    boxShadow: 10
                },
                height: '48vh'
            }}
            elevation={4}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <CardHeader title="Tags"
                    sx={{
                        display: 'inline-block',
                        '&.MuiCardHeader-root': {
                            paddingRight: 0
                        }
                    }}
                />
                <Tooltip title="Double click a tag to edit"
                    placement="left"
                    arrow
                    sx={{
                        marginRight: '10px'
                    }}
                >
                    <Info fontSize="large" />
                </Tooltip>
            </Box>
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                    marginBottom={3}
                >
                    <TextField variant="outlined" size="small"
                        sx={{
                            width: '14vw'
                        }}
                    />
                    <Button color="secondary"
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'secondary.main',
                            ':hover': {
                                backgroundColor: 'secondary.light',
                                color: 'primary.main'
                            }
                        }}
                    >
                        Add
                    </Button>
                </Box>
                <List
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}
                >
                    <ListItem
                        sx={{
                            width: 'fit-content',
                            margin: '0 0 10px 10px',
                            padding: '0 10px',
                            transition: 'all 0.2s',
                            ':hover': {
                                boxShadow: '0 0 8px rgba(0,0,0,0.6)',
                                transform: 'scale(1.1)'
                            },
                            userSelect: 'none'
                        }}
                    >
                        <ListItemText
                            primary="Node JS"
                            primaryTypographyProps={{ fontSize: "16px" }}
                        />
                        <IconButton
                            onClick={() => { }}
                            sx={{
                                ':hover': {
                                    backgroundColor: 'transparent'
                                }
                            }}
                        >
                            <Delete fontSize="small"
                                sx={{
                                    ':hover': {
                                        color: 'secondary.main'
                                    }
                                }}
                            />
                        </IconButton>
                    </ListItem>
                </List>
            </CardContent>
        </Card>
    )
}