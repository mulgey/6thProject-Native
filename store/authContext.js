import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// diğer sayfalar içerisinde bu const u çağıracağız useContext için
// initial values below help for the auto-complation later
export const AuthContext = createContext({
  token: "",
  isAuthenticated: false,
  // when signed-up or logged-in
  authenticate: (token) => {},
  // when logged-out
  logout: () => {},
});

// actual provider / wrapper with the actual logic, so will be exported by default
function AuthContextProvider({ children }) {
  const [authToken, tokenAksiyonu] = useState();

  function authenticate(token) {
    tokenAksiyonu(token);
    // tokeni aynı zamanda cihaza da yüklemek istiyoruz, tekrar login gerekmesin diye
    // "key" ve "value" string olmalıdır. ayrıca app ilk defa başladığında bunu kontrol edecek sistemi de kurmalıyız
    // kontrol kurulumunu app.js içerisinde yaptık
    AsyncStorage.setItem("token", token);
  }

  function logout() {
    tokenAksiyonu(null);
    // aynı zamanda asyncStorage den de silmeliyiz
    AsyncStorage.removeItem("token");
  }

  // tüm veriyi ve fonksiyonları aşağıda paketleyip aşağıya, app-wide kullanılmak üzere yollayacağız
  const value = {
    token: authToken,
    // iki ünlem = token varsa isAuthenticated: true
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
