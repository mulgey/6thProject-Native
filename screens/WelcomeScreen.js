import { StyleSheet, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";

// for data-protection regarding our token demo purpose
import axios from "axios";

// context-API stuff
import { AuthContext } from "../store/authContext";

function WelcomeScreen() {
  // for data-protection regarding our token demo purpose
  const [fetchedMessage, mesajAksiyonu] = useState("");

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  // useEffect executes the action right when the component was first evaluated
  useEffect(() => {
    // async - await'ten kaçınıp good-old ".then()" metodunu kullandık
    axios
      // firebase'de URL sonuna json eklemeliyiz
      // firebase rules'a ".read": "auth.uid != null", ekledik (write için de) erişimi uid varlığı ile kısıtladık
      // sonra burada URL sonuna ?auth=${token} ekleyerek auth olduğunu da ilettik
      .get(
        `https://react-native-stage10-default-rtdb.europe-west1.firebasedatabase.app/message.json?auth=${token}`
      )
      .then((response) => {
        mesajAksiyonu(response.data);
      });
  }, [token]);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>You authenticated successfully!</Text>
      {/* yukarıda URL sonuna eklediğimiz token sonucunda aşağıdaki protected resource a ait yazıyı ekranda görebildik */}
      <Text>{fetchedMessage}</Text>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
