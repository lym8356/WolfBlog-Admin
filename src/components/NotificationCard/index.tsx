import React, { useState } from "react";
import { useSelector, useAppDispatch } from "../../redux/hooks";
import { selectNotificationPage, setAboutPage } from "../../redux/slices/aboutPageSlice";
import { AboutPage } from "../../models/aboutPage";
import agent from "../../utils/agent";
import { toast } from "react-toastify";
import { Notifications } from "@mui/icons-material";
import {
    Box, Card, CardContent, CardHeader,
    Dialog, DialogActions, DialogContent, DialogTitle, Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik } from "formik";
import CustomTextfield from "../FormsUI/CustomTextfield";

export const NotificationCard: React.FC = () => {
    const notification = useSelector(selectNotificationPage);
    const dispatch = useAppDispatch();
    const [notificationFormValues, setNotificationFormValues] = useState<AboutPage>(notification || {} as AboutPage);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogToggle = () => setDialogOpen(prevState => !prevState);

    const handleSubmit = async (aboutPage: AboutPage) => {
        try {
            const response: AboutPage = await agent.Abouts.update(aboutPage);
            toast.success("Notification Updated");
            dispatch(setAboutPage(response));
            handleDialogToggle();
        } catch (error) {
            console.log(error);
            toast.error("Error performing action");
        }
    };

    const buttonStyle = {
        backgroundColor: 'primary.main',
        color: 'secondary.main',
        ':hover': {
            backgroundColor: 'secondary.light',
            color: 'primary.main'
        }
    };

    return (
        <Card sx={{ height: '140px', ':hover': { boxShadow: 10 }, overflow: "auto", paddingBottom: "5px" }} elevation={4}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <CardHeader title="Notification" sx={{ paddingBottom: 1 }} />
                <Notifications fontSize="medium" sx={{ color: "secondary.main" }} />
            </Box>
            <CardContent sx={{ paddingTop: 0 }} onClick={handleDialogToggle}>
                <Typography>{notification?.content}</Typography>
            </CardContent>
            <Dialog open={dialogOpen} onClose={handleDialogToggle} fullWidth maxWidth="sm">
                <DialogTitle>Notification Edit</DialogTitle>
                <DialogContent>
                    <Formik initialValues={notificationFormValues} onSubmit={handleSubmit}>
                        {({ handleSubmit, isSubmitting }) => (
                            <Form autoComplete="false" style={{ width: "100%" }} onSubmit={handleSubmit}>
                                <CustomTextfield name="content" label="Content" fullWidth multiline rows={3} sx={{ margin: ".5vw 0" }} />
                                <DialogActions>
                                    <LoadingButton size="medium" variant="contained" type="submit" loading={isSubmitting} disabled={isSubmitting} sx={buttonStyle}>Confirm</LoadingButton>
                                    <LoadingButton size="medium" variant="contained" type="button" disabled={isSubmitting} onClick={handleDialogToggle} sx={buttonStyle}>Cancel</LoadingButton>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </Card>
    );
};
