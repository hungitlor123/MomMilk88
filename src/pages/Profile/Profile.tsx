import { useEffect, useState } from "react";
import Footer from "../../components/Layout/Footer";
import Header from "../../components/Layout/Header";
import ProfileComponent from "../../components/ProfileComponent/ProfileComponent";
import { useAppSelector } from "../../service/store/store";
import instance from "../../service/api/customAxios";


const Profile= () => {
    const { account } = useAppSelector((state) => state.auth);
    const isCustomer = account && account.user && account.user.role.includes('Customer');
    const customerId = localStorage.getItem('customerId')
    const [userInfo, setUserInfo] = useState({
      "id": "",
      "username": "",
      "name": "",
      "phone": "",
      "address": "",
      "point": 0,
      "status": "",
      "createAt": ""
    })
    const loadUserInfo=async()=>{
      await instance.get(`/Accounts/customers/${customerId}`).then(res => setUserInfo(res.data)).catch(err => console.log(err))
    }
    useEffect(() => {
      loadUserInfo()
    }, []);
  return (
    <>
      {isCustomer && (
        <div className="grid h-screen" style={{ gridTemplateRows: 'auto 1fr auto' }}>
        <div className="row-start-1 row-end-2">
            <Header />
        </div>
        {userInfo.name && <div className="row-start-2 row-end-3 grid" style={{ gridTemplateRows: 'auto 1fr' }}>
          <ProfileComponent
            phone={userInfo?.phone} 
            name={userInfo?.name} 
            address={userInfo?.address}
          />
        </div>}
        <div className="row-start-3 row-end-4">
            <Footer />
        </div>
      </div>
    )}

</>

  );
};

export default Profile;