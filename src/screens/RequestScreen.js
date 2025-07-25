import React, { useState, useCallback } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs';
import Share from 'react-native-share'
import FileViewer from "react-native-file-viewer";
import { useFocusEffect } from '@react-navigation/native';

const FileList = ({ }) => {
    const [files, setFiles] = useState([]);
    const [key, setKey] = useState(0);
    const contentPath = "/Downloadss"
    const getFiles = (path) => {

        // List files in the directory
        RNFS.exists(path)
            .then(async (exists) => {
                if (exists) {
                    try {
                        const files = await RNFS.readDir(path); // e.g., RNFS.DocumentDirectoryPath
                        setFiles(files);
                    } catch (error) {
                        Alert.alert('Error reading files:', error);
                    }
                } else {
                    Alert.alert('File does not exist');
                }
            })
            .catch((error) => {
                Alert.alert('Error finding files:', error);
            });

    };

    const handleClick = (selectedFile) => {
        const options = { title: 'Share PDF', url: 'file://' + selectedFile.path, type: 'application/pdf', };
        Alert.alert("", selectedFile.name, [{ 'text': 'Cancel', 'style': 'cancel' }, {
            'text': 'Open', onPress: () => {
                openFile(selectedFile.path)
            }
        }])
        const openFile = (path) => {
            FileViewer.open(path, {
                showAppsSuggestions: true,
                showOpenWithDialog: true
            }) // absolute-path-to-my-local-file.
                .then(() => {
                    // success
                })
                .catch((error) => {
                    Alert.alert("Error while Opening file", error);
                });
        }
        // Share.open(options)
        //     .then((res) => {
        //         console.log(res);
        //     })
        //     .catch((err) => {
        //         err && console.log(err);
        //     });
    }
    useFocusEffect(
        useCallback(() => {
            // Code to execute when the tab is focused 

            const path = `${RNFS.ExternalDirectoryPath}${contentPath}`;

            getFiles(path);
            setKey(prevKey => prevKey + 1);
        }, []));
    return (
        <View style={{ flex: 1, paddingHorizontal: 20 }} key={key}>
            {files.map((file, index) => (
                <TouchableOpacity onPress={() => handleClick(file)} key={index}>
                    <View style={{ width: '100%', borderWidth: 1, borderRadius: 7, padding: 10, marginBottom: 15 }}>
                        <Text key={index} style={{ color: "black", fontWeight: '500', fontSize: 17 }}>{file.name}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default FileList;
