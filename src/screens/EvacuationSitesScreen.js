import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import AppBackground from '../components/AppBackground';
import StyleButton from '../components/StyleButton';
import StyleTextInput from '../components/StyleTextInput';

const EvacuationSitesScreen = ({ navigation, route }) => {
  const [sites, setSites] = useState([]);
  const [query, setQuery] = useState('');

  // Handle new site additions
  useEffect(() => {
    if (route.params?.newSite) {
      setSites(currentSites => {
        // Check if site already exists (based on timestamp)
        const exists = currentSites.some(site => site.timestamp === route.params.newSite.timestamp);
        if (exists) {
          return currentSites; // Don't add if already exists
        }
        return [...currentSites, route.params.newSite];
      });
      // Clear the parameter to prevent duplicate additions
      navigation.setParams({ newSite: null });
    }
  }, [route.params?.newSite]);

  const handleDeleteSite = async (siteToDelete) => {
    setSites(currentSites => currentSites.filter(site => site !== siteToDelete));
  };

  return (
    <AppBackground>
      <View className="flex-1 px-5 pt-6 pb-6">
        {/* Header row */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Evacuation Sites</Text>
          <StyleButton
            title="+"
            onPress={() => navigation.navigate('EvacSiteDetailsScreen')}
            className="w-12 h-12 rounded-full justify-center items-center bg-blue-500"
          />
        </View>

        {/* Search / filter */}
        <StyleTextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search sites or address"
          className="mb-4"
        />

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
          {sites && sites.length > 0 ? (
            sites
              .filter(site => {
                if (!query) return true;
                const q = query.toLowerCase();
                return (
                  String(site.siteName || '').toLowerCase().includes(q) ||
                  String(site.siteAddress || '').toLowerCase().includes(q) ||
                  String(site.managerName || '').toLowerCase().includes(q)
                );
              })
              .map((site, index) => (
                <View key={index} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                  <View className="flex-row items-start">
                    {site.images && site.images.length > 0 ? (
                      <Image
                        source={{ uri: site.images[0] }}
                        className="w-24 h-24 rounded-lg mr-4"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-24 h-24 rounded-lg mr-4 bg-gray-100 justify-center items-center">
                        <Text className="text-gray-400">No image</Text>
                      </View>
                    )}

                    <View className="flex-1">
                      <Text className="text-lg font-bold mb-1">{site.siteName}</Text>
                      <Text className="text-sm text-gray-600 mb-2">{site.siteAddress}</Text>

                      <View className="mb-3">
                        <Text className="text-sm text-gray-500">Contact</Text>
                        <Text className="text-base text-gray-800 font-medium">{site.managerName || '—'}</Text>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <View>
                          <Text className="text-sm text-gray-500">Capacity</Text>
                          <Text className="text-base text-gray-800">{site.maxCapacity ? `${site.maxCapacity} people` : '—'}</Text>
                        </View>

                        <View className="items-end">
                          <Text className="text-sm text-gray-500">Slots</Text>
                          <Text className="text-base text-gray-800">{site.slotsAvailable ?? '—'}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row mt-4 space-x-3">
                    <StyleButton
                      title="View Details"
                      onPress={() => navigation.navigate('EvacSiteDetailsView', { site })}
                      className="flex-1 h-12 justify-center"
                    />
                    <StyleButton
                      title="Delete"
                      onPress={() => handleDeleteSite(site)}
                      className="flex-1 h-12 justify-center bg-red-500"
                    />
                  </View>
                </View>
              ))
          ) : (
            <View className="flex-1 justify-center items-center py-10">
              <View className="bg-white rounded-xl p-6 shadow-sm">
                <Text className="text-gray-500 text-base text-center">No evacuation sites added yet.</Text>
                <Text className="text-gray-400 text-sm text-center mt-3">Tap + to add your first site</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View className="mt-4">
          <StyleButton 
            title="Return to Menu"
            onPress={() => navigation.navigate('UserProfile')}
            className="bg-gray-700"
          />
        </View>
      </View>
    </AppBackground>
  );
};

export default EvacuationSitesScreen;

// Remove any global styles since we're using Tailwind classes