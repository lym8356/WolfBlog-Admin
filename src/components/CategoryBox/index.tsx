import { Delete, Edit } from "@mui/icons-material"
import { Button, Card, CardContent, CardHeader, IconButton, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Tooltip } from "@mui/material"
import { Box } from "@mui/system"


export const CategoryBox: React.FC = () => {
    return (
        <Card
            sx={{
                ':hover': {
                    boxShadow: 10,
                },
                height: '48vh'
            }}
            elevation={4}
        >
            <CardHeader title="Categories" />
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
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
                <TableContainer
                    sx={{
                        maxHeight: '35vh',
                        marginTop: '2vh'
                    }}
                >
                    <Table size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell align="left">Category A</TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        onClick={() => { }}
                                        sx={{
                                            ':hover': {
                                                backgroundColor: 'transparent'
                                            }
                                        }}
                                    >
                                        <Edit 
                                            sx={{
                                                ':hover': {
                                                    color: 'secondary.main'
                                                }
                                            }}
                                        />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => { }}
                                        sx={{
                                            ':hover': {
                                                backgroundColor: 'transparent'
                                            }
                                        }}
                                    >
                                        <Delete
                                            sx={{
                                                ':hover': {
                                                    color: 'secondary.main'
                                                }
                                            }}
                                        />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    )
}