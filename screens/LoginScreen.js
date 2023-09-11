import { useContext, useState } from "react";
import { Alert } from "react-native";

// components & utilities
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { kullaniciGirisi } from "../util/auth";

// context-provider
import { AuthContext } from "../store/authContext";

function LoginScreen() {
  // loading state oluşturmak istiyoruz. ekran ilk yüklendiğinde işleme başlamıyoruz = false
  const [authluyor, authlamaAksiyonu] = useState(false);

  // hazırladığımız context'i devreye sokalım
  const authCntxt = useContext(AuthContext);

  async function girisFonksiyonu({ email, password }) {
    // authlama işlemi başlıyor, "true" yapalım
    authlamaAksiyonu(true);
    try {
      // aşağıdaki fonk. auth.js içerisinde async olup promise return'lediği için burayı da async - await yaptık
      // auth.js de aşağıdaki fonksiyonun return promise'i token idi, onu const ladık
      const token = await kullaniciGirisi(email, password);
      // giriş yaptıktan sonra firebase'den gelen tokeni context'e enjekte edelim
      authCntxt.authenticate(token);
    } catch (hata) {
      // daha detaylı hata mesajları gönderilebilir. Bu jenerik versiyon kalıyor
      Alert.alert(
        "Hobaaa...",
        `Giriş esnasında bir hata oluştu. Hata mesajı: ${hata}`
      );
      // işlem bitti, authlamayı "false"layalım
      // bu işlem try - catch in dışındaydı, fakat component ile iş bittikten sonra çalışmaya çalıştığı için hata veriyordu
      // sadece hata verince çalışsın diye catch içerisine aldık
      authlamaAksiyonu(false);
    }
  }

  if (authluyor) {
    return <LoadingOverlay message="Giriş yapılıyor..." />;
  }

  return <AuthContent isLogin onAuthenticate={girisFonksiyonu} />;
}

export default LoginScreen;
