import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./components/AuthLayout";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Chat from "./pages/Chat";
import { AuthFlowProvider } from "./context/AuthFlowContext";
import { ChatProvider } from "./context/ChatContext";
import { UserProvider } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import { TextSizeProvider } from "./context/TextSizeContext";
export default function App() {
  return (
    <ThemeProvider>
      <TextSizeProvider>
        <UserProvider>
          <AuthFlowProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
              <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
              <Route path="/verify-otp" element={<AuthLayout><VerifyOtp /></AuthLayout>} />
              <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
              <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />
              <Route
                path="/chat"
                element={
                  // <RequireAuth>
                    <ChatProvider>
                      <Chat />
                    </ChatProvider>
                  // </RequireAuth>
                }
              />
            </Routes>
          </AuthFlowProvider>
        </UserProvider>
      </TextSizeProvider>
    </ThemeProvider>
  );
}
