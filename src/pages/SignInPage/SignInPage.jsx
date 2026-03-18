import React, { useState, useEffect } from "react";
import { Image } from "antd";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputForm from "../../components/InputForm/InputForm";
import imageLogo from "../../Assets/img/logoLogin.png";
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import * as message from '../../components/Message/Message'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slide/userSlide'

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation(); // Khởi tạo location để lấy đường dẫn cũ
  const dispatch = useDispatch();

  const mutation = useMutationHooks(
    (data) => UserService.loginUser(data)
  )
  
  const { data, isPending, isSuccess, isError } = mutation

  useEffect(() => {
    if (isSuccess && data?.status !== 'ERR') {
      // Kiểm tra xem có đường dẫn cũ được truyền qua không
      if(location?.state) {
        navigate(location?.state) // Quay lại trang sản phẩm đang xem dở
      } else {
        navigate('/') // Nếu không có thì về trang chủ như bình thường
      }
      
      localStorage.setItem('access_token', JSON.stringify(data?.access_token))
      
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token)
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token }))
  }

  const handleNavigateSignUp = () => { navigate('/signup'); };
  const handleOnchangeEmail = (value) => { setEmail(value); };
  const handleOnchangePassword = (value) => { setPassword(value); };

  const handleSignIn = () => {
    mutation.mutate({ email, password })
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0, 0, 0, 0.53)", height: "100vh", }}>
      <div style={{ width: "800px", height: "445px", borderRadius: "6px", background: "#fff", display: "flex", }}>
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập hoặc tạo tài khoản</p>
          <InputForm style={{ marginBottom: "10px" }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
          <div style={{ position: "relative" }}>
            <span style={{ zIndex: 10, position: "absolute", top: "4px", right: "8px", cursor: "pointer", }} onClick={() => setIsShowPassword(!isShowPassword)}>
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm placeholder="password" type={isShowPassword ? "text" : "password"} value={password} onChange={handleOnchangePassword} />
          </div>
          {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
          <Loading isLoading={isPending}>
            <ButtonComponent
              disabled={!email.length || !password.length} onClick={handleSignIn} bordered={false} size={40}
              styleButton={{ background: "rgb(255, 57, 69)", height: "48px", width: "100%", border: "none", borderRadius: "4px", margin: "26px 0 10px", }}
              textButton={"Đăng nhập"} styleTextButton={{ color: "#fff", fontSize: "15px", fontWeight: "700" }}
            />
          </Loading>
          <p><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p>
          <p>Chưa có tài khoản?{" "}<WrapperTextLight style={{ cursor: 'pointer' }} onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperTextLight></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={imageLogo} preview={false} alt="image-logo" height="203px" width="203px" />
          <h4>Mua sắm tại ULTRA WATCH</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignInPage;