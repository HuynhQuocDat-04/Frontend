import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { routes } from './routes'
import HeaderComponent from './components/HeaderComponent/HeaderComponent'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import { jwtDecode } from "jwt-decode";
import * as UserService from './services/UserService'
import { useDispatch, useSelector } from 'react-redux'
import { updateUser } from './redux/slide/userSlide'
import Loading from './components/LoadingComponent/Loading'

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const { storageData, decoded } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    } else {
      setIsLoading(false)
    }
  }, [])

  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  const handleGetDetailsUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token)
      dispatch(updateUser({ ...res?.data, access_token: token }))
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              // Nếu route không yêu cầu admin, cho phép vào. Nếu yêu cầu admin, check user.isAdmin
              const ischeckAuth = !route.isAdmin || user.isAdmin
              const Layout = route.isShowHeader ? DefaultComponent : React.Fragment
              
              return (
                <Route 
                  key={route.path} 
                  path={ischeckAuth ? route.path : undefined} 
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  } 
                />
              )
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  )
}

export default App