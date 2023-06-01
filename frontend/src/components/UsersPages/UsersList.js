import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { URL } from "../../environments/env";
import { styles } from "../../style/style";
import { Users } from "../../models/users";
import { useState } from "react";
import React from "react";
import axios from "axios";

export default function UsersList({ navigation }) {
  //#region atributos
  let users = [];
  let user = new Users();

  const [data, setData] = useState([]);
  //#endregion

  //#region functions

  //#region services

  const getUsers = async () => {
    await axios
      .get(`${URL}/users/getAll`)
      .then((response) => {
        if (response.data) {
          setData(response.data);
        } else {
          console.log("No hay datos para mostrar");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  function editUser(item) {
    const findUser = data.find((x) => x._id === item._id);
    if (data && findUser) {
      navigation.navigate("Signup", { user: findUser });
    }
  }
  //#endregion

  //#region events
  //#endregion

  //#endregion

  //#region front ("HTML")
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users List</Text>
      <TouchableOpacity onPress={getUsers}>
        <Text style={styles.subtitle}>Gestiona los usuarios - Click aquí</Text>
      </TouchableOpacity>

      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                editUser(item);
              }}
            >
              <Text style={styles.item}>
                {item.name} - {item.email} | Click to Edit
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
        />
      </SafeAreaView>
    </View>
  );
}
//#endregion
