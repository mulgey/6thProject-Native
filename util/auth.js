import axios from "axios";

const endPointURL =
  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";

const API_KEY = "AIzaSyDngUFuaqwCiBFMXNEfdxnm4iQfphb6fgo";

// loading spinner ve diğer muhtemel durumlar için fonksiyonu async yapıp promise topladık
export async function kullaniciOlustur(email, password) {
  const response = await axios.post(endPointURL + API_KEY, {
    email: email,
    password: password,
    // alttaki standart değişmez
    returnSecureToken: true,
  });
}
