import { useContext, useState } from "react";
import { Alert } from "react-native";

// components & utilities
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { kullaniciOlustur } from "../util/auth";

// context-provider
import { AuthContext } from "../store/authContext";

function SignupScreen() {
  // loading state oluşturmak istiyoruz. ekran ilk yüklendiğinde işleme başlamıyoruz = false
  const [authluyor, authlamaAksiyonu] = useState(false);

  // hazırladığımız context'i devreye sokalım
  const authCntxt = useContext(AuthContext);

  async function kayitFonksiyonu({ email, password }) {
    // authlama işlemi başlıyor, "true" yapalım
    authlamaAksiyonu(true);
    try {
      // aşağıdaki fonk. auth.js içerisinde async olup promise return'lediği için burayı da async - await yaptık
      // auth.js de aşağıdaki fonksiyonun return promise'i token idi, onu const ladık
      const token = await kullaniciOlustur(email, password);
      // kullanıcıyı oluşturduktan sonra firebase'den gelen tokeni context'e enjekte edelim
      authCntxt.authenticate(token);
    } catch (hata) {
      // daha detaylı hata mesajları gönderilebilir. Bu jenerik versiyon kalıyor7
      Alert.alert(
        "Hobaaa...",
        `Kayıt esnasında bir hata oluştu. Hata mesajı: ${hata}`
      );
    }

    // işlem bitti, authlamayı "false"layalım
    authlamaAksiyonu(false);
  }

  if (authluyor) {
    return <LoadingOverlay message="Kullanıcı oluşturuluyor..." />;
  }

  return <AuthContent onAuthenticate={kayitFonksiyonu} />;
}

export default SignupScreen;
