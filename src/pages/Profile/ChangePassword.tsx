import { useState } from "react";
import { Button, Card, CardContent, Typography, IconButton, InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";
import instance from "../../service/api/customAxios";
import { toast } from "react-toastify";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const customerId = localStorage.getItem('customerId');

    const handleChangePassword = async () => {
        if (form.newPassword !== form.confirmPassword) {
            toast.error('New password and confirm password do not match!');
            return;
        }

        const { oldPassword, newPassword } = form; // Extract necessary fields
        await instance.patch(`/accounts/customers/change-password/${customerId}`, { oldPassword, newPassword })
            .then(() => {
                toast.success('Change password successfully!');
                navigate('/home');
            })
            .catch(err => {
                console.log(err);
                toast.error('Change failed: Old password unmatched!');
            });
    };

    return (
        <div className="grid h-screen" style={{ gridTemplateRows: 'auto 1fr auto' }}>
            <div className="row-start-1 row-end-2">
                <Header />
            </div>
            <div className="row-start-2 row-end-3 grid" style={{ gridTemplateRows: 'auto 1fr' }}>
                <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
                    <Card className="w-full max-w-md p-6 shadow-md">
                        <CardContent>
                            <Typography variant="h5" className="mb-6 text-center">
                                Change Password
                            </Typography>
                            <div className="mb-4">
                                <TextField
                                    id="oldPassword"
                                    name="oldPassword"
                                    value={form.oldPassword}
                                    onChange={e => setForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                                    type={showOldPassword ? "text" : "password"}
                                    placeholder="Enter your old password..."
                                    className="mt-2 p-2 border-2 border-pink-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle old password visibility"
                                                    onClick={handleClickShowOldPassword}
                                                    edge="end"
                                                >
                                                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <TextField
                                    id="newPassword"
                                    name="newPassword"
                                    value={form.newPassword}
                                    onChange={e => setForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter your new password..."
                                    className="mt-2 p-2 border-2 border-pink-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle new password visibility"
                                                    onClick={handleClickShowNewPassword}
                                                    edge="end"
                                                >
                                                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <div className="mb-4">
                                <TextField
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={e => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your new password..."
                                    className="mt-2 p-2 border-2 border-pink-400 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 w-full"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle confirm password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>

                            <Button onClick={handleChangePassword} variant="contained" color="primary" fullWidth>
                                Change Password
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="row-start-3 row-end-4">
                <Footer />
            </div>
        </div>
    );
};

export default ChangePassword;
