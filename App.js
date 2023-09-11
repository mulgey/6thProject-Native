import { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";

// screens
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

// constants & components
import { Colors } from "./constants/styles";
import IconButton from "./components/ui/IconButton";

// context provider
import AuthContextProvider, { AuthContext } from "./store/authContext";

const Stack = createNativeStackNavigator();

function NotAuthedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              size={24}
              color={tintColor}
              onPress={authCtx.logout}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {/* context ten kontrol ettiğimiz "isAuthenticated" in durumuna göre conditional rendering */}
      {!authCtx.isAuthenticated && <NotAuthedStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

// context kullanabilmek için work-around uydurmamız olan root componenti
function Root() {
  // loading-state management için state'i kuruyoruz. başta yüklediği için true yaptık
  const [tryingLog, logginAksiyonu] = useState(true);

  const authCtx = useContext(AuthContext);

  // app ilk yüklendiğinde token kontrolü yapacak kodu yazıyoruz. to avoid the first-flickering
  useEffect(() => {
    // .getItem() bir promise return leyeceği için bir helper fonksiyonu üzerinden async leriz
    async function tokenFetchle() {
      // aşağıda "setItem" üzerinde kullandığımız "key"i kullanırız
      const mevcutToken = await AsyncStorage.getItem("token");

      // eğer bir token var ise uygulama başlarken context üzerinden bunu authToken'e yükleriz
      if (mevcutToken) {
        authCtx.authenticate(mevcutToken);
      }

      // işlem bittikten sonra yükleme durumunu false layabiliriz
      logginAksiyonu(false);
    }
    // yukarıda tanımladığımız async func nu ateşleyelim
    tokenFetchle();
  }, []);

  // yükleme durumuna göre root içerisinde loading-spinner veya navigation'ı render layalım
  if (tryingLog) {
    return <AppLoading />;
  }

  // context ile token kontrol işlemi sonrasında ekranı return lüyoruz
  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
