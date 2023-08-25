// components & utilities
import AuthContent from "../components/Auth/AuthContent";
import { kullaniciOlustur } from "../util/auth";

function SignupScreen() {
  function kayitFonksiyonu({ email, password }) {
    kullaniciOlustur(email, password);
  }

  return <AuthContent onAuthenticate={kayitFonksiyonu} />;
}

export default SignupScreen;
