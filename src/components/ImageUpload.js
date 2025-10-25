import { Alert, Linking } from "react-native";
import * as ImagePicker from 'expo-image-picker';

const CLOUDINARY_UPLOAD_PRESET = 'ECFIND';
const CLOUDINARY_CLOUD_NAME = 'deud6ifqi';
const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


const getNewFileObject = (asset) => {
    const uri = asset.uri;
    return {
        uri: uri,
        type: `image/${uri.split('.').pop()}`,
        name: `site-image-${Date.now()}.${uri.split('.').pop()}`
    };
};

export const handleCloudinaryUpload = async (image) => {
    const data = new FormData();
    data.append('file', {
        uri: image.uri,
        type: image.type,
        name: image.name
    });
    data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); 
    data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

    try {
        console.log('Starting upload to Cloudinary...');
        const response = await fetch(CLOUDINARY_API_URL, {
            method: 'post',
            body: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload response not ok:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Upload result:', result);
        
        if (result.secure_url) {
            return result.secure_url; 
        } else {
            throw new Error("Cloudinary upload failed: " + (result.error?.message || 'Unknown error'));
        }
    } catch (error) {
        console.error("Upload Error:", error);
        Alert.alert(
            "Upload Failed", 
            "Failed to upload image. Please check your internet connection and try again."
        );
        throw error;
    }
};



export const uploadAssets = async (assets) => {
    try {
        const limited = assets.slice(0, 4);
        const results = [];
        
        for (const asset of limited) {
            try {
                const fileObj = getNewFileObject(asset);
                const siteUrl = await handleCloudinaryUpload(fileObj);
                results.push({ localUri: asset.uri, siteUrl });
            } catch (error) {
                console.error(`Failed to upload asset: ${asset.uri}`, error);
                // Continue with other uploads even if one fails
                continue;
            }
        }

        if (results.length === 0) {
            throw new Error('All uploads failed');
        }

        return results;
    } catch (error) {
        console.error('Upload assets failed:', error);
        Alert.alert(
            "Upload Failed",
            "Failed to upload images. Please check your internet connection and try again."
        );
        throw error;
    }
};

// --- Gallery Picker (Handles Upload, allows 1-4 files) ---
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const pickFromGallery = async () => {
    try {
        console.log("Requesting gallery permission...");
        // Add a small delay before requesting permission
        await wait(500);
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        // Add a small delay after getting the status
        await wait(500);
        console.log("Gallery permission status:", status);

        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please grant gallery permissions to upload images.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() }
                ]
            );
            return null;
        }

        console.log("Launching gallery picker...");
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            allowsMultipleSelection: true,
            selectionLimit: 4,
            quality: 0.8,
        });

        console.log("Gallery result:", result);

        if (result.canceled) return null;

        const assets = result.assets;
        if (assets.length === 0) return null;

        // Just return the assets without uploading
        return assets;
    } catch (error) {
        console.log("Gallery Error:", error);
        Alert.alert("Error", "Failed to access gallery");
        return null;
    }
};

// Helper to show an Alert that returns a Promise<boolean>
const alertConfirm = (title, message, confirmText = 'Yes', cancelText = 'No') => {
    return new Promise((resolve) => {
        Alert.alert(
            title,
            message,
            [
                { text: cancelText, style: 'cancel', onPress: () => resolve(false) },
                { text: confirmText, onPress: () => resolve(true) },
            ],
            { cancelable: false }
        );
    });
};

// --- Camera Picker (Handles Upload, allows taking 1..4 photos sequentially) ---
export const pickFromCamera = async () => {
    try {
        console.log("Requesting camera permission...");
        // Add a small delay before requesting permission
        await wait(500);
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        // Add a small delay after getting the status
        await wait(500);
        console.log("Camera permission status:", status);

        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Please grant camera permissions to take photos.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() }
                ]
            );
            return null;
        }

        console.log("Launching camera...");
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
            exif: false
        });

        console.log("Camera result:", result);

        if (result.canceled) return null;

        // Just return the asset without uploading
        return result.assets;
    } catch (error) {
        console.log("Camera Error:", error);
        Alert.alert("Error", "Failed to use camera");
        return null;
    }
};