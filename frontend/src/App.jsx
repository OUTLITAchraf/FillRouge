import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProviderRegisterPage from "./pages/Register/ProviderRegisterPage"
import UserRegisterPage from "./pages/Register/UserRegisterPage"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/provider/register" element={<ProviderRegisterPage/>}/>
          <Route path="/user/register" element={<UserRegisterPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
