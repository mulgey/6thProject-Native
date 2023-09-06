import axios from "axios";

const API_KEY = "AIzaSyDngUFuaqwCiBFMXNEfdxnm4iQfphb6fgo";

// sign-up veya login gibi farklı "mode"larda çalışacak tek fonksiyonumuzu hazırladık
async function authenticate(mode, email, password) {
  const basicURL = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  // her ikisi de POST request
  const response = await axios.post(basicURL, {
    email: email,
    password: password,
    // alttaki standart değişmez
    returnSecureToken: true,
  });

  // response'dan token'i alalım
  const token = response.data.idToken;
  return token;
}

// loading spinner ve diğer muhtemel durumlar için fonksiyonu async yapıp promise topladık
export async function kullaniciOlustur(email, password) {
  // "signUp", endPoint URL'deki exact spelling dir
  const token = await authenticate("signUp", email, password);
  // const token eklememizin sebebi yukarıda promise return ünün token olmasıdır
  return token;
}

// yukarıdaki fonksiyondan farklı olarak burada daha sade ve pratik versiyonunu tercih ettik
export function kullaniciGirisi(email, password) {
  // "signInWithPassword", endPoint URL'deki exact spelling dir
  // just returned the promise above in the authenticate function
  return authenticate("signInWithPassword", email, password);
}
