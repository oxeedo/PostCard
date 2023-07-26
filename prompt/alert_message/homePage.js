import React from 'react'
import { View, Text, Button, Alert, FlatList, StyleSheet, StatusBar, TouchableOpacity, } from "react-native";
import { useEffect, useState } from "react";

import { Card } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";

const homePage = () => {
    const [data, setData] = useState([]);

    const getPosts = () => {
        fetch("https://c0d4-102-91-4-178.ngrok.io/posts")

            .then((res) => res.json())

            .then(resJson => {
                console.log(resJson)
                setData(resJson)
            }).catch(e => { console.log(e) })
    }
    const addPosts = (author, title) => {
        fetch("https://c0d4-102-91-4-178.ngrok.io/posts", {
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

    const edit = () => {

    }
    useEffect(() => {
        getPosts()
    },)

    const deletePost = (postId) => {
        fetch(`https://2e07-197-210-70-93.ngrok.io/posts/${postId}`, {
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
    return (
        <SafeAreaView>

            <View style={styles.container}>
                <StatusBar style="auto" />

                <FlatList data={data}

                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        return (

                            <Card style={{ padding: 16, margin: 16 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>
                                        <Text>{item.title}</Text>
                                        <Text>{item.author}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }} >
                                        <TouchableOpacity onPress={() => edit()} style={{ marginHorizontal: 5, }}>
                                            <AntDesign name="edit" size={24} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => deletePost(item.id)}>
                                            <AntDesign name="delete" size={24} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </Card>
                        )
                    }}

                />
                < Button title="Add Post" onPress={() => addPosts('John', "new post")} />

            </View ></SafeAreaView>
    )
}

export default homePage

const styles = StyleSheet.create({
    text: {
        marginTop: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',

        justifyContent: 'center'

    }
})