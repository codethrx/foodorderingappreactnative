import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { db } from "../config/index";
import { useAuth } from "../context/authentication";
import { collection, getDocs, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const Login = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState({ loading: false, error: null });
  const { setUser } = useAuth();
  const { navigate } = useNavigation();
  const signIn = async () => {
    if (!username || !password) {
      setStatus({
        ...status,
        error: "Kindly Enter valid username and password",
      });
      return;
    }
    try {
      setStatus({ loading: true, error: null });
      const userExist = await getDocs(
        query(collection(db, "waiters"), where("username", "==", username))
      );
      const data = userExist.docs.map((d) => ({ ...d.data(), id: d.id }));

      if (data.length === 0) {
        setStatus({
          loading: false,
          error: "User with this username doesnot exist.",
        });
        return;
      }
      if (data.length === 1 && password !== data[0].password) {
        setStatus({ loading: false, error: "Wrong password" });
        return;
      }

      await AsyncStorage.setItem("credentials", JSON.stringify(data[0]));
      setUser(data[0]);

      setStatus({ loading: false, error: null });
    } catch (e) {
      setStatus({ loading: false, error: "Error Authenticating the user." });
    }
  };
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 bg-gray-100 px-4 pt-28">
        <Text
          className="font-semibold text-3xl py-2"
          style={{ fontFamily: "Poppins_600SemiBold" }}
        >
          Login
        </Text>
        <View className="mb-2">
          <Text
            className="py-2 text-base font-normal"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            Username:
          </Text>
          <TextInput
            className="bg-white text-black py-1 px-1"
            style={{ fontFamily: "Poppins_500Medium" }}
            placeholder="Username"
            selectionColor={"black"}
            value={username}
            onChangeText={(val) => setUsername(val)}
          />
        </View>
        <View>
          <Text className="py-2 text-base font-normal">Password:</Text>
          <TextInput
            className="bg-white text-black py-1 px-1"
            style={{ fontFamily: "Poppins_500Medium" }}
            placeholder="Password"
            selectionColor={"black"}
            secureTextEntry
            value={password}
            onChangeText={(val) => setPassword(val)}
          />
        </View>
        {status.error && (
          <Text
            className="w-full py-2 text-sm text-red-400"
            style={{ fontFamily: "Poppins_500Medium" }}
          >
            {status.error}
          </Text>
        )}

        {!status.loading ? (
          <TouchableOpacity
            onPress={status.loading ? () => {} : signIn}
            className={`w-full mt-4 items-center justify-center ${
              status.loading ? "bg-gray-300" : "bg-blue-900"
            } py-2`}
          >
            <Text
              className={` text-white text-base flex items-center justify-center`}
              style={{ fontFamily: "Poppins_500Medium" }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={status.loading ? () => {} : signIn}
            className={`w-full mt-4 items-center justify-center ${"bg-blue-900"} py-2`}
          >
            <ActivityIndicator color="white" size="large" />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default Login;
