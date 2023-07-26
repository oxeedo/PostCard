import {
  View, Text, Button, Alert, FlatList,
  StyleSheet, StatusBar, TouchableOpacity, SafeAreaView
} from "react-native";
import { useEffect, useState } from "react";
import prompt from 'react-native-prompt-android';
import { Surface, Title, TextInput, Card } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import PostCardItem from "./components/PostCardItem";
import ModalView from "./components/ModalView";
import { ActivityIndicator } from "react-native";

export default function App() {
  const url = 'https://4985-197-210-71-193.ngrok.io/posts'
  // const [name, setname] = useState();

  // const clickMe = () => {
  //   Alert.alert("Welcome", "Please enter your name", [{
  //     text: "Submit",
  //     onPress: (text) => setname(text)
  //   },
  //   {
  //     text: "Cancel",
  //     onPress: () => console.log("Cancel is pressed")
  //   }], "plain-text", "Name")
  // }

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [postId, setPostId] = useState(0);
  const [loading, setLoading] = useState(false);

  const getPosts = async () => {
    setLoading(true)
    await fetch("https://4985-197-210-71-193.ngrok.io/posts")

      .then((res) => res.json())

      .then(resJson => {
        console.log(resJson)
        setData(resJson)
      }).catch(e => { console.log(e) })
    setLoading(false)
  }
  const addPosts = (author, title) => {
    fetch("https://4985-197-210-71-193.ngrok.io/posts", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        "author": author,
        "title": title,
      })
    })
      .then((res) => res.json())
      .then(resJson => {
        console.log('post', resJson)
      }).catch(e => { console.log(e) })
    getPosts()
  }

  const editPost = (postId, title, author) => {
    fetch(url + `/${postId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        "author": author,
        "title": title,
      })
    }).then((res) => res.json())
      .then(resJson => {
        console.log('updated:', resJson)
        updatePost()
      }).catch(e => { console.log(e) })
  }
  useEffect(() => {
    getPosts()
  }, [])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="steelblue" />
      </View>
    )
  }

  const deletePost = (postId) => {
    fetch(`https://4985-197-210-71-193.ngrok.io/posts/${postId}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
      .then((res) => res.json())
      .then(resJson => {
        console.log('delete', resJson)
      }).catch(e => { console.log(e) })
    getPosts()
  }
  const updatePost = () => {
    getPosts()
    setVisible(false);
    setAuthor('')
    setTitle('')
    setPostId(0)
  }

  const edit = (id, title, author) => {
    setVisible(true)
    setPostId(id)
    setTitle(title)
    setAuthor(author)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Surface style={styles.header}>
        <Title>Posts</Title>
        <TouchableOpacity style={styles.button} onPress={() => addPosts('John', "new-post")}>
          <Text style={styles.buttonText}>Add Post</Text>
        </TouchableOpacity>
      </Surface>
      <FlatList data={data}

        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <PostCardItem
              title={item.title}
              author={item.author}
              onEdit={() => edit(item.id, item.title, item.author)}
              onDelete={() => deletePost(item.id)}
            />

          )
        }}

      />
      <ModalView
        visible={visible}
        title="Add Post"
        onDismiss={() => setVisible(false)}
        onSubmit={() => {
          if (postId && title && author) {
            editPost(postId, title, author)
          } else {
            addPosts(title, author)
          }
        }}
        cancelable
      >
        <TextInput
          label="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
          mode="outlined"
        />
        <TextInput
          label="Author"
          value={author}
          onChangeText={(text) => setAuthor(text)}
          mode="outlined"
        />
      </ModalView>
    </SafeAreaView >
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    marginTop: Platform.OS === 'android' ? 10 : 0,
    padding: 16,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  button: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'steelblue',
  },
  buttonText: {
    color: 'white'
  },
});
