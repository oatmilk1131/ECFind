import React, { useState, useCallback } from 'react';
import { View, Button, Image, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { pickFromGalleryAndUpload, pickFromCameraAndUpload } from './ImageUpload';

export default function ImagePickerTest() {
    const [images, setImages] = useState([]); 

    const handleGalleryPick = async () => {
        try {
            const result = await pickFromGalleryAndUpload();
            console.log('Gallery upload result:', result);
            if (result && Array.isArray(result)) {
                const uris = result.map(item => item.localUri);
                console.log('Setting preview URIs:', uris);
                setImages(uris);
            }
        } catch (error) {
            console.error('Gallery pick error:', error);
            Alert.alert('Error', 'Failed to process gallery selection');
        }
    };

    const handleCameraPick = async () => {
        try {
            const result = await pickFromCameraAndUpload();
            console.log('Camera upload result:', result);
            if (result && Array.isArray(result)) {
                const uris = result.map(item => item.localUri);
                console.log('Setting preview URIs:', uris);
                setImages(uris);
            }
        } catch (error) {
            console.error('Camera pick error:', error);
            Alert.alert('Error', 'Failed to process camera photos');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView horizontal contentContainerStyle={styles.previewRow}>
                {images.length > 0 ? (
                    images.map((uri, idx) => (
                        <View key={idx} style={styles.imageContainer}>
                            <Image 
                                source={{ uri }} 
                                style={styles.image}
                                onError={(error) => console.error(`Image load error for ${uri}:`, error)}
                            />
                        </View>
                    ))
                ) : (
                    <Text style={styles.placeholder}>Selected images will appear here</Text>
                )}
            </ScrollView>
            <View style={styles.buttonContainer}>
                <Button title="Pick from Gallery" onPress={handleGalleryPick} />
                <View style={{ width: 12 }} />
                <Button title="Take Photo(s)" onPress={handleCameraPick} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    previewRow: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    imageContainer: {
        marginRight: 12,
        borderRadius: 8,
        backgroundColor: '#eee',
        overflow: 'hidden',
    },
    image: {
        width: 140,
        height: 140,
        resizeMode: 'cover',
    },
    placeholder: {
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 18,
    },
});