import { View, Text, TouchableOpacity, Alert, Modal, Image, ScrollView, TextInput, Vibration } from "react-native";
import React, { useState } from 'react';
import StyleButton from '../components/StyleButton'; 
import StyleTextInput from '../components/StyleTextInput';
import { pickFromGallery, pickFromCamera, uploadAssets } from '../components/ImageUpload'; 
import AppBackground from '../components/AppBackground'; 


export default function EvacSiteDetailsScreen({ navigation, route }) {
    const isViewMode = route.params?.site !== undefined;
    const initialDetails = route.params?.site || {
        siteName: '',
        siteAddress: '',
        managerName: '',
        contactNumber: '',
        maxCapacity: '',
        slotsAvailable: ''
    };
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [isUploading, setIsUploading] = useState(false); 
    const [siteImageUrls, setSiteImageUrls] = useState([]);
    const [siteDetails, setSiteDetails] = useState(initialDetails);

    // Keep only necessary shadow styles for modal
    const modalStyle = {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    };


    const handleImagePick = async (pickerFunction) => {
        setModalVisible(false);
        try {
            const assets = await pickerFunction();
            if (assets && assets.length > 0) {
                // Combine existing assets with new ones, up to 4 total
                const updatedAssets = [...selectedAssets, ...assets].slice(0, 4);
                setSelectedAssets(updatedAssets);
            }
        } catch (error) {
            console.error("Image pick failed.", error);
            Alert.alert("Error", "Failed to pick image");
        }
    };

    const handleSubmitSiteDetails = async () => {
        // Validate required fields
        const requiredFields = {
            'Site Name': siteDetails.siteName,
            'Site Address': siteDetails.siteAddress,
            'Contact Person Name': siteDetails.managerName,
            'Contact Number': siteDetails.contactNumber,
            'Maximum Capacity': siteDetails.maxCapacity,
            'Slots Available': siteDetails.slotsAvailable
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            Alert.alert(
                "Missing Information",
                "Please fill in the following required fields:\n\n" + missingFields.join('\n')
            );
            return;
        }

        if (selectedAssets.length === 0) {
            Alert.alert("Missing Photos", "Please select at least one photo for the site.");
            return;
        }

        if (selectedAssets.length === 0) {
            Alert.alert("Missing Photos", "Please select at least one photo for the site.");
            return;
        }

        setIsUploading(true);
        try {
            // Show uploading indicator
            console.log('Starting image upload...');
            const uploads = await uploadAssets(selectedAssets);
            
            if (!uploads || uploads.length === 0) {
                throw new Error('No images were uploaded successfully');
            }

            const siteUrls = uploads.map(upload => upload.siteUrl);
            console.log('Images uploaded successfully:', siteUrls);
            
            // Combine site details with image URLs
            const completeDetails = {
                ...siteDetails,
                images: siteUrls,
                timestamp: new Date().toISOString()
            };

            // Prepare the document data for Firebase
            const siteDocument = {
                ...completeDetails,
                createdAt: new Date().toISOString(), // Will be replaced with Firebase Timestamp
                updatedAt: new Date().toISOString(), // Will be replaced with Firebase Timestamp
                status: 'active',
                // When implementing Firebase, we'll add:
                // createdBy: auth.currentUser.uid,
                // location: new firebase.firestore.GeoPoint() // if you need geolocation
            };

            // TODO: This will be replaced with Firebase add document
            console.log('Ready for Firebase:', siteDocument);

            Alert.alert(
                "Success",
                "Site details submitted successfully!",
                [
                    { 
                        text: "OK", 
                        onPress: () => {
                            // First set the params on the target route
                            navigation.setParams({ newSite: null });
                            // Then navigate back to EvacuationSitesScreen with the new site
                            navigation.navigate('EvacuationSitesScreen', { 
                                newSite: siteDocument,
                                timestamp: new Date().getTime() // Force param change detection
                            });
                        }
                    }
                ]
            );
        } catch (error) {
            console.error("Submission failed:", error);
            Alert.alert(
                "Upload Error",
                "Failed to upload images. Please check your internet connection and try again.",
                [
                    { text: "OK" }
                ]
            );
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = (index) => {
        const newAssets = [...selectedAssets];
        newAssets.splice(index, 1);
        setSelectedAssets(newAssets);
    };


    return (
        <AppBackground>
            <View className="flex-1 p-5">
                <Text className="text-2xl font-bold mb-5">Evacuation Site Details</Text>

                <ScrollView className="flex-1">
                    {/* Site Information Form */}
                    <View className="mb-6">
                        <Text className="pl-3 pb-1 font-bold">Site Name</Text>
                        {isViewMode ? (
                            <Text className="pl-4 text-lg">{siteDetails.siteName}</Text>
                        ) : (
                            <StyleTextInput
                                placeholder="e.g. Barangay Community Center"
                                value={siteDetails.siteName}
                                onChangeText={(text) => setSiteDetails(prev => ({...prev, siteName: text}))}
                                autoCapitalize="words"
                            />
                        )}

                        <Text className="pl-3 pb-1 font-bold mt-3">Site Address</Text>
                        {isViewMode ? (
                            <Text className="pl-4 text-lg">{siteDetails.siteAddress}</Text>
                        ) : (
                            <StyleTextInput
                                placeholder="e.g. 123 Main Street, Barangay Example"
                                value={siteDetails.siteAddress}
                                onChangeText={(text) => setSiteDetails(prev => ({...prev, siteAddress: text}))}
                                autoCapitalize="words"
                            />
                        )}

                        <Text className="text-lg font-bold mt-6 mb-3">Contact Person Information</Text>

                        <Text className="pl-3 pb-1 font-bold">Site Contact Person</Text>
                        {isViewMode ? (
                            <Text className="pl-4 text-lg">{siteDetails.managerName}</Text>
                        ) : (
                            <StyleTextInput
                                placeholder="e.g. Juan Dela Cruz"
                                value={siteDetails.managerName}
                                onChangeText={(text) => setSiteDetails(prev => ({...prev, managerName: text}))}
                                autoCapitalize="words"
                            />
                        )}

                        <Text className="pl-3 pb-1 font-bold mt-3">Contact Number</Text>
                        {isViewMode ? (
                            <Text className="pl-4 text-lg">{siteDetails.contactNumber}</Text>
                        ) : (
                            <StyleTextInput
                                placeholder="e.g. 09123456789"
                                value={siteDetails.contactNumber}
                                onChangeText={(text) => setSiteDetails(prev => ({...prev, contactNumber: text}))}
                                keyboardType="phone-pad"
                            />
                        )}

                        <Text className="text-lg font-bold mt-6 mb-3">Capacity Information</Text>

                        <Text className="pl-3 pb-1 font-bold">Maximum Capacity</Text>
                        {isViewMode ? (
                            <Text className="pl-4 text-lg">{siteDetails.maxCapacity} people</Text>
                        ) : (
                            <StyleTextInput
                                placeholder="e.g. 100"
                                value={siteDetails.maxCapacity}
                                onChangeText={(text) => setSiteDetails(prev => ({...prev, maxCapacity: text}))}
                                keyboardType="numeric"
                            />
                        )}

                        <Text className="pl-3 pb-1 font-bold mt-3">Slots Available</Text>
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={() => {
                                    const currentValue = parseInt(siteDetails.slotsAvailable) || 0;
                                    const maxValue = parseInt(siteDetails.maxCapacity) || 0;
                                    if (currentValue > 0) {
                                        setSiteDetails(prev => ({
                                            ...prev,
                                            slotsAvailable: String(currentValue - 1)
                                        }));
                                    }
                                }}
                                className="w-12 h-12 bg-gray-200 rounded-full justify-center items-center"
                            >
                                <Text className="text-2xl font-bold text-gray-600">-</Text>
                            </TouchableOpacity>
                            
                            <View className="flex-1 mx-3">
                                <StyleTextInput
                                    placeholder="e.g. 50"
                                    value={siteDetails.slotsAvailable}
                                    onChangeText={(text) => {
                                        const newValue = parseInt(text) || 0;
                                        const maxValue = parseInt(siteDetails.maxCapacity) || 0;
                                        if (!text) {
                                            setSiteDetails(prev => ({...prev, slotsAvailable: ''}));
                                        } else if (newValue >= 0 && (!maxValue || newValue <= maxValue)) {
                                            setSiteDetails(prev => ({...prev, slotsAvailable: String(newValue)}));
                                        }
                                    }}
                                    keyboardType="numeric"
                                    className="text-center"
                                />
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    const currentValue = parseInt(siteDetails.slotsAvailable) || 0;
                                    const maxValue = parseInt(siteDetails.maxCapacity) || 0;
                                    if (!maxValue || currentValue < maxValue) {
                                        setSiteDetails(prev => ({
                                            ...prev,
                                            slotsAvailable: String(currentValue + 1)
                                        }));
                                    }
                                }}
                                className="w-12 h-12 bg-gray-200 rounded-full justify-center items-center"
                            >
                                <Text className="text-2xl font-bold text-gray-600">+</Text>
                            </TouchableOpacity>
                        </View>
                        {parseInt(siteDetails.maxCapacity) > 0 && (
                            <Text className="pl-3 mt-1 text-sm text-gray-500">
                                Maximum capacity: {siteDetails.maxCapacity}
                            </Text>
                        )}
                    </View>

                    <Text className="text-lg font-bold mb-3">Site Photos</Text>
                    <View className="mb-2.5 h-48">
                        <ScrollView horizontal>
                            {isUploading ? (
                                <View className="w-44 h-48 bg-gray-200 justify-center items-center rounded-xl mr-2.5 overflow-hidden">
                                    <Text className="text-gray-600">Uploading...</Text>
                                </View>
                            ) : (
                                (() => {
                                    // Decide which images to show: in view mode use siteDetails.images (URLs), otherwise use selectedAssets (local assets)
                                    const imagesToShow = isViewMode ? (siteDetails.images || []) : selectedAssets.map(a => a.uri);
                                    if (!imagesToShow || imagesToShow.length === 0) {
                                        return (
                                            <View className="w-44 h-48 bg-gray-200 justify-center items-center rounded-xl">
                                                <Text className="text-gray-600">No Images Selected{"\n"}(Select up to 4)</Text>
                                            </View>
                                        );
                                    }

                                    return imagesToShow.map((img, index) => (
                                        <View key={index} className="w-44 h-48 bg-gray-200 justify-center items-center rounded-xl mr-2.5 overflow-hidden relative">
                                            <Image source={{ uri: img }} className="w-full h-full" resizeMode="cover" />
                                            {!isViewMode && (
                                                <TouchableOpacity 
                                                    onPress={() => handleRemoveImage(index)}
                                                    className="absolute top-1 right-1 bg-black/60 w-6 h-6 rounded-full justify-center items-center"
                                                >
                                                    <Text className="text-white text-lg font-bold">×</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    ));
                                })()
                            )}
                        </ScrollView>
                    </View>
                </ScrollView>

                <View className="mt-auto">
                    {!isViewMode ? (
                        <>
                            <StyleButton 
                                title={isUploading ? "Uploading..." : 
                                    selectedAssets.length >= 4 ? "Maximum Images Selected" :
                                    selectedAssets.length > 0 ? "Add More Images" : "Upload Site Photos"}
                                onPress={() => { if (selectedAssets.length < 4) setModalVisible(true); }}
                                className={`py-3 px-5 rounded-full w-full items-center mb-3 ${selectedAssets.length >= 4 ? 'opacity-50' : ''}`}
                                disabled={isUploading || selectedAssets.length >= 4}
                            />

                            <StyleButton 
                                title="Submit Site Details"
                                onPress={handleSubmitSiteDetails}
                                className="py-3 px-5 rounded-full w-full items-center mb-3 bg-green-600"
                                disabled={isUploading}
                            />
                        </>
                    ) : (
                        <StyleButton 
                            title="Update Available Slots"
                            onPress={() => {
                                // TODO: Will be replaced with Firebase update
                                navigation.goBack();
                            }}
                            className="py-3 px-5 rounded-full w-full items-center mb-3 bg-green-600"
                        />
                    )}
                </View>

            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="bg-white rounded-xl p-8 items-center" style={modalStyle}>
                        <Text className="text-lg font-bold mb-4">Choose Image Source</Text>
                        
                        <StyleButton 
                            title="From Gallery" 
                            onPress={() => handleImagePick(pickFromGallery)} 
                            className="w-40 my-2" 
                        />
                        <StyleButton 
                            title="Take Photo" 
                            onPress={() => handleImagePick(pickFromCamera)} 
                            className="w-40 my-2" 
                        />
                        
                        <StyleButton 
                            title="Cancel" 
                            onPress={() => setModalVisible(false)} 
                            className="w-40 my-2 bg-red-500"
                        />
                    </View>
                </View>
            </Modal>
        </AppBackground>
    );
}

// styles removed, using Tailwind classes