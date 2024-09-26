import { Avatar, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../service/store/store';
import instance from '../../service/api/customAxios';
import { toast } from 'react-toastify';

interface ProfileProps {
  address?: string;
  phone?: string;
  name?: string;
  avatarUrl?: string | null;
}

const ProfileComponent: React.FC<ProfileProps> = ({ address, phone, name, avatarUrl }) => {
    const navigate = useNavigate()
    const [info, setInfo] = useState({
      address: address,
      phone: phone,
      name: name
    })
    const { account } = useAppSelector((state) => state.auth);
    const isCustomer = account && account.user && account.user.role.includes('Customer');
    const customerId = localStorage.getItem('customerId')
    const handleUpdateProfile = async() => {
      await instance.put(`/Accounts/customers/update/${customerId}`,info).then(()=>{
        toast.success('Update succesfully!')
      }).catch(err => {console.log(err); toast.error('Update failed!')})
    }
  return (
    <div className={`${isCustomer ? "flex justify-center items-center min-h-screen bg-gray-100 p-4 " : "flex justify-center items-center p-4"}`}>
    <Card className="w-full max-w-4xl p-6 shadow-md">
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Avatar
              alt="Profile Picture"
              src={avatarUrl ? avatarUrl : "https://imagev3.vietnamplus.vn/w1000/Uploaded/2024/mzdic/2024_01_10/ronaldo-the-ky-21-1-5129.jpg.webp "}
              className="w-24 h-24 mr-4"
            />
            <div>
              <Typography variant="h6">{info.name}</Typography>
            </div>
          </div>
          <div>
          <Button sx={{marginRight:'12px'}} variant="outlined" color="primary" onClick={()=> {navigate('/change-password')}}>
            Change Password
          </Button>
          <Button onClick={handleUpdateProfile}
              value={phone} color="primary"
              variant="outlined"
            >Update profile</Button>
          </div>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <TextField
              label="Name"
              value={info.name} onChange={e => setInfo(prev => ({...prev, name: e.target.value}))}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              value={info.address} onChange={e => setInfo(prev => ({...prev, address: e.target.value}))}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contact Number"
              value={info.phone} onChange={e => setInfo(prev => ({...prev, phone: e.target.value}))}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </div>
  );
};

export default ProfileComponent;