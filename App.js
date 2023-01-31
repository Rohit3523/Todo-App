import * as React from 'react';
import { Text, View, Pressable, FlatList, Keyboard, Dimensions, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height, width } = Dimensions.get('window');

export default function App() {
  const [text, setText] = React.useState("");
  const [todoitems, setItems] = React.useState([]);
  const [page, setPage] = React.useState(0);

  React.useEffect(() => {
    try {
      AsyncStorage.getItem('items').then((data) => {
        if(data == null) return;
        
        setItems(JSON.parse(data));
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  function addItem() {
    Keyboard.dismiss();
  
    setItems((prev) => {
      prev.push({
        id: Math.random().toString(36).substring(2),
        label: text,
        favourite: false,
      });

      setText("");
      AsyncStorage.setItem('items', JSON.stringify(prev));

      return prev;
    });
  }

  function removeItem(id) {
    setItems((prev) => {
      prev = prev.filter((x) => x.id != id);

      AsyncStorage.setItem('items', JSON.stringify(prev));

      return prev;
    });
  }

  function favouriteItem(id) {
    setItems((prev) => {
      prev = prev.map((x) => {
        if(x.id == id) x.favourite = !x.favourite;

        return x;
      });

      prev = [...prev.filter((x) => x.favourite), ...prev.filter((x) => !x.favourite)]

      AsyncStorage.setItem('items', JSON.stringify(prev));

      return prev;
    });
  }

  function footerButton(type) {
    if(type == "next") {
      if(page < Math.ceil(todoitems.length / 4) - 1) setPage(page + 1);
    } else {
      if(page > 0) setPage(page - 1);
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.todo_item} >
      <Text style={styles.todo_label}>{item.label}</Text>
      <View style={styles.todo_buttons}>
        <Pressable style={styles.todo_button} onPress={() => favouriteItem(item.id)}>
        <AntDesign name={item.favourite ? "star" : "staro"} size={24} color="black" />
        </Pressable>
        <Pressable style={styles.todo_button} onPress={() => removeItem(item.id)}>
          <Ionicons name="trash-outline" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.header}>Todo List</Text>
        <View style={styles.box}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              mode={'outlined'}
              label="Enter your todo task"
              value={text}
              onChangeText={(text) => setText(text)}
              style={styles.textinput}
            />
            <Pressable style={styles.submitbutton} onPress={()=> addItem()}>
              <MaterialIcons name="done" size={30} color="black" />
            </Pressable>
          </View>
          
          <FlatList
            style={styles.todos}
            showsVerticalScrollIndicator={false}
            data={todoitems.slice(page * 4, page * 4 + 4)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
          
          <View style={styles.buttons}>
            <Pressable style={styles.button} onPress={()=>{ footerButton("previous") }}>
              <Ionicons name="arrow-back-outline" size={24} color="black" />
            </Pressable>
            <View>
              <FlatList
                horizontal={true}
                data={new Array(Math.ceil(todoitems.length / 4) || 1).fill(0).map((_, i) => i + 1)}
                keyExtractor={(item) => item.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable style={[styles.button, { marginLeft: 5, backgroundColor: item == (page + 1) ? '#f0f2f5' : '#ffffff' }]} onPress={()=> setPage(item - 1)}>
                    <Text>{item}</Text>
                  </Pressable>
                )}
              />
            </View>
            <Pressable style={styles.button} onPress={()=>{ footerButton("next") }}>
              <Ionicons name="arrow-forward-outline" size={24} color="black" />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
    padding: 8,
  },
  container: {
    height: height - 16,
    width: width - 16,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
    marginTop: 5,
  },
  box: {
    marginTop: 5,
    padding: 5,
  },
  textinput: {
    width: width - 80,
    height: 50,
  },
  submitbutton: {
    width: 50,
    height: 50,
    marginLeft: 5,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 5,
  },
  todos: {
    marginTop: 10,
    height: height - 210,
    width: '100%',
  },
  todo_item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
    backgroundColor: '#f0f2f5',
    borderRadius: 5,
  },
  todo_label: {
    fontSize: 20,
    fontWeight: 'bold',
    width: width - 130,
  },
  todo_buttons: {
    flexDirection: 'row',
    marginLeft: 10,
    width: 80
  },
  todo_button: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 10,
  },
  buttons: {
    marginTop: 5,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 10,
  },
  button_text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
});