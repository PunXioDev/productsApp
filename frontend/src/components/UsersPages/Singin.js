import { Text, View, TextInput, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { styles } from "../../style/style";
import { Users } from "../../models/users";
import { useState } from "react";
import React from "react";
import { UsersService } from "../../service/UsersService";
import { NavigationService } from "../../service/NavigationService";
import { StorageData } from "../../service/StorageDataService";
import { Auth } from "../../models/auth";

// localstorage
const USERS_INFO = "@userInfo";
const AUTH_INFO = "@authInfo";
const PRODUCT_INFO = "@productInfo";
const SALE_INFO = "@saleInfo";

export default function SignIn({ navigation }) {
  //#region atributos

  const userService = new UsersService();
  const navigationService = new NavigationService();
  const storageData = new StorageData();

  let userStorage = new Users();
  let usersStorage = [];

  let user = new Users();
  let users = [];

  const [auth, setAuth] = useState([]);
  const [authValidate, setAuthValidate] = useState({});

  const [formData, setFormData] = useState(new Users());
  const [errorMess, setErrorMess] = useState("");

  const { handleSubmit, reset } = useForm({
    defaultValues: new Users(),
  });

  //#endregion

  //#region functions
  const getUsersStorage = async () => {
    await storageData
      .getDataStorage(USERS_INFO, usersStorage)
      .then((response) => {
        if (response) {
          console.log(response);
          usersStorage = JSON.parse(response);
          if (users) {
            userStorage = usersStorage[0];
            console.log(userStorage);
          }
        } else {
          navigationService.logout({ navigation });
        }
      })
      .catch((e) => console.log(e));
  };

  const postUsersStorage = async () => {
    await storageData
      .postDataStorage(USERS_INFO, user)
      .then((response) => {
        if (response && user) {
          console.log(JSON.parse(response));
        } else {
          setErrorMess("Iniciando sesión...");
          setTimeout(() => {
            navigationService.navigateMenu({ navigation });
            setErrorMess("");
          }, 2000);
        }
      })
      .catch((e) => console.log(e));
  };

  //#region services
  const getUserByEmail = async () => {
    await userService
      .getUserByEmail(formData.email)
      .then((response) => {
        if (response.data && formData.password === response.data.password) {
          user = response.data;
          setAuthValidate({ auth: true });
          if (user) {
            postUsersStorage();
          }
        } else {
          setErrorMess("El usuario no esta registrado.");
        }
      })
      .catch((e) => console.log(e));
  };
  //#endregion

  //#region events
  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e });
  };
  //#endregion

  getUsersStorage();
  //#endregion
  if (!userStorage._id) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Login to the application</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(e) => onChange(e, "email")}
          defaultValue={formData.email}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(e) => onChange(e, "password")}
          defaultValue={formData.password}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (formData.email !== "" && formData.password !== "") {
              getUserByEmail();
            } else {
              setErrorMess("Todos los campos son obligatorios");
              setTimeout(() => {
                reset();
                setErrorMess("");
              }, 1500);
            }
          }}
        >
          <Text>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Signup");
          }}
        >
          <Text style={styles.text}>Don't have an account?</Text>
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", marginTop: 10, color: "black" }}>
          {errorMess}
        </Text>
      </View>
    );
  } else {
    navigationService.navigateMenu({ navigation });
  }
}
