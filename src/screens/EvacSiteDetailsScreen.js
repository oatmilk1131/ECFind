import { View, Text, TouchableOpacity, Alert, Modal, Image, ScrollView } from "react-native";
import React, { useEffect, useMemo, useState } from 'react';
import StyleButton from '../components/StyleButton';
import StyleTextInput from '../components/StyleTextInput';
import { pickFromGallery, pickFromCamera, uploadAssets } from '../components/ImageUpload';
import AppBackground from '../components/AppBackground';
import { upsertEvacuationSite, updateSiteImages, updateSiteSlots, updateSiteStatus } from '../utils/dataService';
import { useAuth } from '../context/Auth';
import BackArrow from '../components/BackArrow';

const MAX_SITE_IMAGES = 4;

const createEmptySiteDetails = () => ({
    id: null,
    siteName: '',
    siteAddress: '',
    managerName: '',
    contactNumber: '',
    maxCapacity: '',
    slotsAvailable: '',
    latitude: null,
    longitude: null,
    status: 'active',
    createdBy: null,
    images: [],
});

const mapSiteToDetails = (site = {}) => {
    const base = createEmptySiteDetails();
    return {
        ...base,
        id: site.id ?? base.id,
        siteName: site.siteName ?? site.name ?? base.siteName,
        siteAddress: site.siteAddress ?? site.address ?? base.siteAddress,
        managerName: site.managerName ?? site.contactPerson ?? base.managerName,
        contactNumber: site.contactNumber ?? site.phone ?? base.contactNumber,
        maxCapacity: site.maxCapacity != null
            ? String(site.maxCapacity)
            : site.capacity != null
                ? String(site.capacity)
                : base.maxCapacity,
        slotsAvailable: site.slotsAvailable != null
            ? String(site.slotsAvailable)
            : site.capacity != null
                ? String(site.capacity)
                : base.slotsAvailable,
        latitude: site.latitude ?? base.latitude,
        longitude: site.longitude ?? base.longitude,
        status: site.status ?? base.status,
        createdBy: site.createdBy ?? base.createdBy,
        images: Array.isArray(site.images) ? site.images : base.images,
    };
};

const clampSlotsToCapacity = (slots, maxCapacity) => {
    const max = Number.parseInt(maxCapacity, 10);
    let value = Number.parseInt(slots, 10);
    if (Number.isNaN(value)) value = 0;
    if (!Number.isNaN(max) && max >= 0) {
        if (value > max) value = max;
        if (value < 0) value = 0;
    } else if (value < 0) {
        value = 0;
    }
    return value;
};

const buildSitePayload = (details, images) => {
    const maxCapacity = Number.parseInt(details.maxCapacity, 10) || 0;
    const slotsAvailable = clampSlotsToCapacity(details.slotsAvailable, maxCapacity);

    return {
        id: details.id ?? undefined,
        name: details.siteName,
        siteName: details.siteName,
        siteAddress: details.siteAddress,
        address: details.siteAddress,
        managerName: details.managerName,
        contactNumber: details.contactNumber,
        maxCapacity,
        capacity: maxCapacity,
        slotsAvailable,
        latitude: details.latitude,
        longitude: details.longitude,
        status: details.status ?? 'active',
        createdBy: details.createdBy ?? null,
        images,
    };
};


export default function EvacSiteDetailsScreen({ navigation, route }) {
    const existingSite = route.params?.site;
    const isViewMode = Boolean(existingSite);
    const { user } = useAuth();
    const canCreateSite = user?.role === 'manager';
    const canManageExistingSite = ['manager', 'admin'].includes(user?.role);
    const isSiteOwner = siteDetails?.createdBy != null && user?.id === siteDetails.createdBy;
    const hasAdminPrivileges = ['admin', 'developer'].includes(user?.role);
    const canEditExistingDetails = canManageExistingSite && (isSiteOwner || hasAdminPrivileges);
    const canEditDetails = !isViewMode ? canCreateSite : canEditExistingDetails;
    const isReadOnly = isViewMode && !canEditExistingDetails;
    const canEditPhotos = !isViewMode ? canCreateSite : canEditExistingDetails;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const [isUploading, setIsUploading] = useState(false); 
    const [siteDetails, setSiteDetails] = useState(
        existingSite ? mapSiteToDetails(existingSite) : createEmptySiteDetails()
    );

    useEffect(() => {
        if (!route?.params?.coordinate) return;
        if (route?.params?.siteId && siteDetails?.id && route.params.siteId !== siteDetails.id) return;
        setSiteDetails((prev) => ({
            ...prev,
            latitude: route.params.coordinate.latitude,
            longitude: route.params.coordinate.longitude,
        }));
        if (navigation.setParams) {
            navigation.setParams({ coordinate: undefined });
        }
    }, [route?.params?.coordinate, route?.params?.siteId, siteDetails?.id, navigation]);

    const availableSelectionSlots = useMemo(() => {
        if (!canEditPhotos) return 0;
        const existingCount = siteDetails.images?.length ?? 0;
        const baseLimit = isViewMode ? Math.max(0, MAX_SITE_IMAGES - existingCount) : MAX_SITE_IMAGES;
        return Math.max(0, baseLimit - selectedAssets.length);
    }, [isViewMode, siteDetails.images, selectedAssets.length, canEditPhotos]);

    // Keep only necessary shadow styles for modal
    const modalStyle = {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    };

    const handleUpdateSiteDetails = () => {
        if (!canEditExistingDetails) return;
        const requiredFields = {
            'Site Name': siteDetails.siteName,
            'Site Address': siteDetails.siteAddress,
            'Contact Person Name': siteDetails.managerName,
            'Contact Number': siteDetails.contactNumber,
            'Maximum Capacity': siteDetails.maxCapacity,
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

        const updatedSite = upsertEvacuationSite(
            buildSitePayload(
                siteDetails,
                siteDetails.images ?? []
            )
        );
        setSiteDetails(mapSiteToDetails(updatedSite));
        Alert.alert('Success', 'Site information updated.');
        navigation.navigate('EvacuationSites', {
            updatedSite,
            timestamp: new Date().getTime(),
        });
    };


    const handleImagePick = async (pickerFunction) => {
        setModalVisible(false);
        if (!canEditPhotos) {
            Alert.alert("Not allowed", "You do not have permission to modify site photos.");
            return;
        }
        if (availableSelectionSlots <= 0) {
            Alert.alert("Photo Limit Reached", "Please remove a photo before selecting a new one.");
            return;
        }
        try {
            const assets = await pickerFunction();
            if (assets && assets.length > 0) {
                const limited = assets.slice(0, availableSelectionSlots);
                setSelectedAssets((prev) => [...prev, ...limited]);
            }
        } catch (error) {
            console.error("Image pick failed.", error);
            Alert.alert("Error", "Failed to pick image");
        }
    };

    const handleSubmitSiteDetails = async () => {
        if (isViewMode || !canCreateSite) {
            Alert.alert('Access denied', 'Only site managers can create evacuation sites.');
            return;
        }
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

        setIsUploading(true);
        try {
            const uploads = await uploadAssets(selectedAssets);

            if (!uploads || uploads.length === 0) {
                throw new Error('No images were uploaded successfully');
            }

            const imageUrls = uploads.map((upload) => upload.siteUrl).slice(0, MAX_SITE_IMAGES);
            const detailsWithOwner = {
                ...siteDetails,
                createdBy: siteDetails.createdBy ?? user?.id ?? null,
            };
            const savedSite = upsertEvacuationSite(
                buildSitePayload(
                    detailsWithOwner,
                    imageUrls
                )
            );

            Alert.alert(
                "Success",
                "Site details submitted successfully!",
                [
                    { 
                        text: "OK", 
                        onPress: () => {
                            navigation.navigate('EvacuationSites', { 
                                newSite: savedSite,
                                timestamp: new Date().getTime()
                            });
                        }
                    }
                ]
            );
            setSiteDetails(mapSiteToDetails(savedSite));
            setSelectedAssets([]);
        } catch (error) {
            console.error("Submission failed:", error);
            Alert.alert(
                "Upload Error",
                "Failed to upload images. Please check your internet connection and try again."
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

    const handleUploadPhotosForExistingSite = async () => {
        if (!isViewMode || !canManageExistingSite) {
            Alert.alert('Not allowed', 'Only site managers or administrators can update site photos.');
            return;
        }
        if (!siteDetails.id) {
            Alert.alert("Missing Site", "Unable to find this site record.");
            return;
        }
        if (selectedAssets.length === 0) {
            Alert.alert("No Photos Selected", "Select photos first, then tap Upload.");
            return;
        }
        setIsUploading(true);
        try {
            const uploads = await uploadAssets(selectedAssets);
            if (!uploads || uploads.length === 0) {
                throw new Error('No images were uploaded successfully');
            }
            const newUrls = uploads.map((upload) => upload.siteUrl);
            const mergedImages = [...(siteDetails.images ?? []), ...newUrls].slice(0, MAX_SITE_IMAGES);
            const updatedSite = updateSiteImages(siteDetails.id, mergedImages);
            setSiteDetails(mapSiteToDetails(updatedSite));
            setSelectedAssets([]);
            Alert.alert("Success", "Site photos updated.");
            navigation.navigate('EvacuationSites', {
                updatedSite,
                timestamp: new Date().getTime(),
            });
        } catch (error) {
            console.error("Upload failed:", error);
            Alert.alert("Upload Error", "Failed to upload images. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdateAvailableSlots = () => {
        if (!isViewMode || !siteDetails.id) {
            Alert.alert("Unavailable", "Slots can only be updated for saved sites.");
            return;
        }
        if (!canManageExistingSite) {
            Alert.alert('Not allowed', 'Only site managers or administrators can update availability.');
            return;
        }
        const updated = updateSiteSlots(
            siteDetails.id,
            clampSlotsToCapacity(siteDetails.slotsAvailable, siteDetails.maxCapacity)
        );
        setSiteDetails(mapSiteToDetails(updated));
        Alert.alert("Success", "Available slots updated.");
        navigation.navigate('EvacuationSites', {
            updatedSite: updated,
            timestamp: new Date().getTime(),
        });
    };


    if (!isViewMode && !canCreateSite) {
        return (
            <AppBackground>
                <View className="flex-1 justify-center items-center p-6">
                    <Text className="text-center text-lg font-semibold mb-4">
                        Only approved site managers can create evacuation sites.
                    </Text>
                    <StyleButton title="Go Back" onPress={() => navigation.goBack()} />
                </View>
            </AppBackground>
        );
    }

    return (
        <AppBackground>
            <View className="flex-1 p-5">
                <View className="flex-row items-center mb-3">
                    <BackArrow />
                    <Text className="text-2xl font-bold ml-4">Evacuation Site Details</Text>
                </View>

                <ScrollView className="flex-1">
                    {/* Site Information Form */}
                    <View className="mb-6">
                        <Text className="pl-3 pb-1 font-bold">Site Name</Text>
                        {isReadOnly ? (
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
                        {isReadOnly ? (
                            <Text className="pl-4 text-lg">{siteDetails.siteAddress}</Text>
                        ) : (
                            <StyleTextInput
                                placeholder="e.g. 123 Main Street, Barangay Example"
                                value={siteDetails.siteAddress}
                                onChangeText={(text) => setSiteDetails(prev => ({...prev, siteAddress: text}))}
                                autoCapitalize="words"
                            />
                        )}

                        <TouchableOpacity
                            onPress={() => {
                                if (isViewMode) {
                                    navigation.navigate('AddEvacuationSite', {
                                        returnTo: 'EvacSiteDetails',
                                        siteId: siteDetails.id,
                                        initialCoordinate:
                                            siteDetails.latitude && siteDetails.longitude
                                                ? {
                                                      latitude: siteDetails.latitude,
                                                      longitude: siteDetails.longitude,
                                                  }
                                                : undefined,
                                    });
                                } else {
                                    navigation.navigate('AddEvacuationSite');
                                }
                            }}
                        >
                            <Text className="pl-3 pb-1 font-bold mt-3 text-blue-500">
                                {isViewMode ? 'Update Location on Map' : 'Select Location on Map'}
                            </Text>
                        </TouchableOpacity>
                        {isViewMode && (
                            <View className="mt-1 pl-3">
                                <Text className="font-bold text-sm">Coordinates</Text>
                                <Text className="text-gray-600 text-sm">
                                    {siteDetails.latitude ?? '—'}, {siteDetails.longitude ?? '—'}
                                </Text>
                            </View>
                        )}


                        <Text className="text-lg font-bold mt-6 mb-3">Contact Person Information</Text>

                        <Text className="pl-3 pb-1 font-bold">Site Contact Person</Text>
                        {isReadOnly ? (
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
                        {isReadOnly ? (
                            <Text className="pl-4 text-lg">{siteDetails.contactNumber}</Text>
                        ) : (
                            <StyleTextInput
                                placeholder="e.g. 09123456789"
                                value={siteDetails.contactNumber}
                                onChangeText={(text) => setSiteDetails(prev => ({...prev, contactNumber: text}))}
                                keyboardType="phone-pad"
                            />
                        )}

                        {isViewMode && canEditExistingDetails && (
                            <>
                                <Text className="pl-3 pb-1 font-bold mt-3">Status</Text>
                                <View className="flex-row gap-3 px-3 mt-2">
                                    {['active', 'standby'].map((statusOption) => (
                                        <TouchableOpacity
                                            key={statusOption}
                                            className={`px-4 py-2 rounded-full ${siteDetails.status === statusOption ? 'bg-green-600' : 'bg-gray-200'}`}
                                            onPress={() => setSiteDetails((prev) => ({ ...prev, status: statusOption }))}
                                        >
                                            <Text className={`${siteDetails.status === statusOption ? 'text-white' : 'text-gray-600'} font-semibold`}>
                                                {statusOption.toUpperCase()}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}

                        <Text className="text-lg font-bold mt-6 mb-3">Capacity Information</Text>

                        <Text className="pl-3 pb-1 font-bold">Maximum Capacity</Text>
                        {isReadOnly ? (
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
                                    if (!canManageExistingSite) return;
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
                                    editable={canManageExistingSite}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    if (!canManageExistingSite) return;
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
                    {selectedAssets.length > 0 && (
                        <Text className="text-xs text-gray-500 mb-1">
                            Selected photos (upload to save)
                        </Text>
                    )}
                    <View className="mb-2.5 h-48">
                        <ScrollView horizontal>
                            {isUploading ? (
                                <View className="w-44 h-48 bg-gray-200 justify-center items-center rounded-xl mr-2.5 overflow-hidden">
                                    <Text className="text-gray-600">Uploading...</Text>
                                </View>
                            ) : (
                                (() => {
                                    const showingSelected = selectedAssets.length > 0;
                                    const imagesToShow = showingSelected
                                        ? selectedAssets.map((asset) => asset.uri)
                                        : (siteDetails.images || []);
                                    const allowRemoval = !isViewMode || showingSelected;
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
                                                {allowRemoval && (
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
                    {canEditPhotos && (
                        <StyleButton
                            title={
                                isUploading
                                    ? "Uploading..."
                                    : availableSelectionSlots <= 0
                                        ? "Photo Limit Reached"
                                        : selectedAssets.length > 0
                                            ? "Add More Images"
                                            : "Upload Site Photos"
                            }
                            onPress={() => {
                                if (availableSelectionSlots > 0 && !isUploading) {
                                    setModalVisible(true);
                                }
                            }}
                            className={`py-3 px-5 rounded-full w-full items-center mb-3 ${availableSelectionSlots <= 0 ? 'opacity-50' : ''}`}
                            disabled={isUploading || availableSelectionSlots <= 0}
                        />
                    )}

                    {!isViewMode ? (
                        canCreateSite ? (
                            <StyleButton
                                title="Submit Site Details"
                                onPress={handleSubmitSiteDetails}
                                className="py-3 px-5 rounded-full w-full items-center mb-3 bg-green-600"
                                disabled={isUploading}
                            />
                        ) : (
                            <Text className="text-center text-gray-500 mb-3">
                                Only approved site managers can create new evacuation sites.
                            </Text>
                        )
                    ) : (
                        <>
                            {canEditExistingDetails && (
                                <>
                                    <StyleButton
                                        title="Save Site Info"
                                        onPress={handleUpdateSiteDetails}
                                        className="py-3 px-5 rounded-full w-full items-center mb-3 bg-orange-600"
                                        disabled={isUploading}
                                    />
                                    <StyleButton
                                        title={isUploading ? "Saving Photos..." : "Upload Selected Photos"}
                                        onPress={handleUploadPhotosForExistingSite}
                                        className={`py-3 px-5 rounded-full w-full items-center mb-3 bg-blue-600 ${selectedAssets.length === 0 ? 'opacity-50' : ''}`}
                                        disabled={isUploading || selectedAssets.length === 0}
                                    />
                                    <StyleButton
                                        title="Update Available Slots"
                                        onPress={handleUpdateAvailableSlots}
                                        className="py-3 px-5 rounded-full w-full items-center mb-3 bg-green-600"
                                        disabled={isUploading}
                                    />
                                    <StyleButton
                                        title={`Set Status: ${siteDetails.status?.toUpperCase?.() ?? 'ACTIVE'}`}
                                        onPress={() => {
                                            const nextStatus = siteDetails.status === 'active' ? 'standby' : 'active';
                                            const updated = updateSiteStatus(siteDetails.id, nextStatus);
                                            setSiteDetails(mapSiteToDetails(updated));
                                            Alert.alert('Updated', `Status set to ${nextStatus.toUpperCase()}`);
                                            navigation.navigate('EvacuationSites', {
                                                updatedSite: updated,
                                                timestamp: new Date().getTime(),
                                            });
                                        }}
                                        className="py-3 px-5 rounded-full w-full items-center mb-3 bg-purple-600"
                                        disabled={!siteDetails.id}
                                    />
                                </>
                            )}
                        </>
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
