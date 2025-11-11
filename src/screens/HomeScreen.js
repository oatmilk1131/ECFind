import React, { useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Animated, StatusBar, Dimensions, ScrollView } from 'react-native';
import MapBackground from '../components/MapBackground';
import BottomSheet from '../components/BottomSheet';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import StyleButton from '../components/StyleButton';
import { useDatabase } from '../context/DatabaseContext';

const BOTTOM_SHEET_MAX_HEIGHT = Math.round(Dimensions.get('window').height * 0.8);
const BOTTOM_SHEET_MIN_HEIGHT = Math.round(Dimensions.get('window').height * 0.3);

const HomeScreen = ({ navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { evacSites, siteManagers } = useDatabase();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);

  const bottomSheetHeight = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;

  const managerLookup = useMemo(() => {
    const map = new Map();
    siteManagers.forEach((manager) => {
      if (manager.site?.id) {
        map.set(manager.site.id, manager);
      }
    });
    return map;
  }, [siteManagers]);

  const handleMarkerPress = (site) => {
    if (site) {
      setSelectedSite(site);
      bottomSheetHeight.setValue(BOTTOM_SHEET_MIN_HEIGHT);
      setIsExpanded(false);
    } else {
      setIsExpanded(false);
      const COLLAPSE_DURATION = 320;
      setTimeout(() => setSelectedSite(null), COLLAPSE_DURATION);
    }
  };

  const handleSiteSelect = (site) => {
    setSelectedSite(site);
    setIsExpanded(true);
  };

  const renderSiteList = () => {
    if (!evacSites?.length) {
      return (
        <View className="py-6 items-center">
          <Text className="text-base text-gray-500">No evacuation sites available.</Text>
        </View>
      );
    }

    return (
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {evacSites.map((site) => (
          <TouchableOpacity
            key={site.id}
            className="mb-3 p-4 bg-gray-100 rounded-2xl"
            onPress={() => handleSiteSelect(site)}
          >
            <Text className="text-lg font-semibold text-gray-800">{site.name}</Text>
            <Text className="text-sm text-gray-600 mt-1">{site.address}</Text>
            <View className="flex-row justify-between mt-2">
              <Text className="text-xs text-gray-500">Status: {site.status}</Text>
              <Text className="text-xs text-gray-500">Slots: {site.slotsAvailable}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderSiteDetails = () => {
    if (!selectedSite) {
      return renderSiteList();
    }

    const manager = managerLookup.get(selectedSite.id);
    return (
      <View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">{selectedSite.name}</Text>
        <Text className="text-sm text-gray-600 mb-3">{selectedSite.address}</Text>
        <View className="mb-3">
          <Text className="text-sm text-gray-500">Capacity</Text>
          <Text className="text-base text-gray-800">{selectedSite.capacity} people</Text>
        </View>
        <View className="mb-3">
          <Text className="text-sm text-gray-500">Available slots</Text>
          <Text className="text-base text-gray-800">{selectedSite.slotsAvailable}</Text>
        </View>
        <View className="mb-3">
          <Text className="text-sm text-gray-500">Status</Text>
          <Text className="text-base text-gray-800">{selectedSite.status}</Text>
        </View>
        <View className="mb-3">
          <Text className="text-sm text-gray-500">Contact number</Text>
          <Text className="text-base text-gray-800">{selectedSite.contactNumber}</Text>
        </View>
        <View className="mb-4">
          <Text className="text-sm text-gray-500">Site manager</Text>
          <Text className="text-base text-gray-800">{manager?.user?.name ?? 'Unassigned'}</Text>
        </View>
        {selectedSite.resources?.length ? (
          <View className="mb-4">
            <Text className="text-sm text-gray-500 mb-1">Available resources</Text>
            <View className="flex-row flex-wrap">
              {selectedSite.resources.map((resource) => (
                <View key={resource} className="bg-blue-100 px-3 py-1 mr-2 mb-2 rounded-full">
                  <Text className="text-xs text-blue-800">{resource}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
        <StyleButton
          title="View all evacuation sites"
          variant="secondary"
          onPress={() => setSelectedSite(null)}
        />
      </View>
    );
  };

  // no animation here — only toggle boolean
  const handleCollapse = () => {
    setIsExpanded(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" >
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <MapBackground onMarkerPress={handleMarkerPress} selectedSite={selectedSite} />

      <BottomSheet
        height={bottomSheetHeight}
        minHeight={BOTTOM_SHEET_MIN_HEIGHT}
        maxHeight={BOTTOM_SHEET_MAX_HEIGHT}
        isExpanded={isExpanded}
        onExpand={handleExpand}
        onCollapse={handleCollapse}
      >
        {renderSiteDetails()}
      </BottomSheet>

      <DeleteConfirmationModal
        visible={showDeleteConfirmation}
        siteToDelete={siteToDelete}
        onConfirm={() => {
          console.log(`Deleting site: ${siteToDelete}`);
          setShowDeleteConfirmation(false);
          setSiteToDelete(null);
        }}
        onCancel={() => {
          setShowDeleteConfirmation(false);
          setSiteToDelete(null);
        }}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;