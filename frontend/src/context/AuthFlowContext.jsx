import { createContext, useContext, useState } from "react";

const AuthFlowContext = createContext(null);

export function AuthFlowProvider({ children }) {
  const [pendingEmail, setPendingEmail] = useState(null);
  const [otpPurpose, setOtpPurpose] = useState("signup");

  const [resetToken, setResetToken] = useState(null);

  function clearResetFlow() {
    setPendingEmail(null);
    setOtpPurpose("signup");
    setResetToken(null);
  }
  return (
    <AuthFlowContext.Provider
      value={{
        pendingEmail,
        setPendingEmail,
        otpPurpose,
        setOtpPurpose,
        resetToken,
        setResetToken,
        clearResetFlow,
      }}
    >
      {children}
    </AuthFlowContext.Provider>
  );
}

export function useAuthFlow() {
  const ctx = useContext(AuthFlowContext);
  if (!ctx) throw new Error("useAuthFlow must be used inside AuthFlowProvider");
  return ctx;
}
