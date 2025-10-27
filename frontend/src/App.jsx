import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProviderRegisterPage from "./pages/ProviderRegisterPage"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/provider/register" element={<ProviderRegisterPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
