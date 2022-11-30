import { Alert, Avatar, Box, Container, Grid, Typography } from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserFormValues } from "../../models/user";
import { useAppDispatch } from "../../redux/hooks";
import { guestPassword, guestUsername } from "../../utils/constant";
import { LoadingButton } from '@mui/lab';
import { login } from "../../redux/slices/accountSlice";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import './index.css';
import CustomTextfield from "../../components/FormsUI/CustomTextfield";


const initialValues = {
    username: '',
    password: '',
    error: null
}
function Login() {

    const dispatch = useAppDispatch();
    // const loading = useSelector((state) => state.account.loading);
    const navigate = useNavigate();

    // const [username, setUsername] = useState('');
    // const [password, setPassword] = useState('');
    const [isGuestLogin, setIsGuestLogin] = useState(false);

    const handleGuestLogin = async () => {
        await dispatch(login({
            username: guestUsername,
            password: guestPassword
        }));
        navigate("/admin");
    }

    const handleAdminLogin = async (values: UserFormValues) => {
        // try {

        // } catch (error) {
        //     console.log(error);
        // }

        await dispatch(login({
            username: values.username,
            password: values.password
        } ));
        navigate("/admin");
    }

    return (
        <Grid className="bg">
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                    }}
                >
                    <Avatar sx={{
                        m: 1, bgcolor: 'secondary.main',
                        color: 'secondary.main',
                        width: '7vh',
                        height: '7vh',
                    }}
                    >
                        <LockOutlinedIcon color="primary" fontSize="large" />
                    </Avatar>
                    <Typography component="h1" variant="h5" color='primary'>
                        Sign in to WolfyBlog Admin
                    </Typography>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={isGuestLogin ? (_, { setErrors }) =>
                            handleGuestLogin()
                                .catch(error => setErrors({ error: 'Error signing in as guest.' }))
                            :
                            (values: UserFormValues, { setErrors }) =>
                                handleAdminLogin(values)
                                    .catch(error => setErrors({ error: 'Invalid username or password.' }))}
                    >
                        {({ handleSubmit, isSubmitting, errors }) => (
                            <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                                <CustomTextfield
                                    margin="normal"
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    autoFocus
                                    // onChange={e => setUsername(e.target.value)}
                                    // value={username}
                                    required={!isGuestLogin}
                                />
                                <CustomTextfield
                                    margin="normal"
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    // onChange={e => setPassword(e.target.value)}
                                    // value={password}
                                    required={!isGuestLogin}
                                />
                                <ErrorMessage
                                    name="error" render={() =>
                                        <Alert severity="error">{errors.error}</Alert>
                                    }
                                />
                                <LoadingButton
                                    color="primary"
                                    loading={isSubmitting}
                                    onClick={() => setIsGuestLogin(false)}
                                    variant="contained"
                                    type="submit"
                                    fullWidth
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        ':hover': {
                                            bgcolor: 'secondary.main',
                                            color: 'black'
                                        }
                                    }}
                                >
                                    Login
                                </LoadingButton>
                                <LoadingButton
                                    loading={isSubmitting}
                                    variant="contained"
                                    onClick={() => setIsGuestLogin(true)}
                                    type="submit"
                                    fullWidth
                                    sx={{
                                        ':hover': {
                                            bgcolor: 'secondary.main',
                                            color: 'black'
                                        }
                                    }}
                                >
                                    Login as Guest
                                </LoadingButton>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Container>
        </Grid>
    )
}


export default Login;