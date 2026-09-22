import { createContext, useContext, useState } from "react";

const AuthFlowContext = createContext(null);

export function AuthFlowProvider({ children }) {
  const [pendingEmail, setPendingEmail] = useState("");
  const [otpPurpose, setOtpPurpose] = useState("SIGNUP");
  const [resetToken, setResetToken] = useState("");

  const clearResetFlow = () => {
    setOtpPurpose("SIGNUP");
    setResetToken("");
    setPendingEmail("");
  };

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
  const context = useContext(AuthFlowContext);

  if (!context) {
    throw new Error(
      "useAuthFlow must be used inside AuthFlowProvider"
    );
  }

  return context;
}