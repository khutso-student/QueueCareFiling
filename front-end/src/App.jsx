import { Routes,Route } from "react-router-dom";
import Signup from './pages/Signup';
import Login from './pages/Login';
import MainDashboard from './pages/Maindashboard'
import ProtectedRoute from './component/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassowrd';
import ResetPassword from './pages/ResetPassword';

function App() {
  return(
    <div>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/maindashboard" element={
            <ProtectedRoute>
              <MainDashboard />
            </ProtectedRoute>
                            }
        />

      </Routes>
    </div>
  )
}

export default App;