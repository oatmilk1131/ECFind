import React, { useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, Alert } from 'react-native';
import AppBackground from '../components/AppBackground';
import StyleButton from '../components/StyleButton';
import StyleTextInput from '../components/StyleTextInput';
import { useDatabase } from '../context/DatabaseContext';

const EvacuationSitesScreen = ({ navigation }) => {
  const { evacSites, siteManagers, removeEvacSite } = useDatabase();
  const [query, setQuery] = useState('');

  const managerLookup = useMemo(() => {
    const map = new Map();
    siteManagers.forEach((manager) => {
      if (manager.site?.id) {
        map.set(manager.site.id, manager);
      }
    });
    return map;
  }, [siteManagers]);

  const filteredSites = useMemo(() => {
    if (!query) {
      return evacSites;
    }
    const q = query.toLowerCase();
    return evacSites.filter((site) => {
      const managerName = managerLookup.get(site.id)?.user?.name ?? '';
      return (
        site.name.toLowerCase().includes(q) ||
        site.address.toLowerCase().includes(q) ||
        managerName.toLowerCase().includes(q)
      );
    });
  }, [evacSites, managerLookup, query]);

  const handleDeleteSite = (site) => {
    Alert.alert(
      'Delete evacuation site',
      `Are you sure you want to remove ${site.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeEvacSite(site.id),
        },
      ]
    );
  };

  return (
    <AppBackground>
      <View className="flex-1 px-5 pt-6 pb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold">Evacuation Sites</Text>
          <StyleButton
            title="+"
            onPress={() => navigation.navigate('EvacSiteDetailsScreen')}
            className="w-12 h-12 rounded-full justify-center items-center bg-blue-500"
          />
        </View>

        <StyleTextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search sites, address or manager"
          className="mb-4"
        />

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 30 }}>
          {filteredSites && filteredSites.length > 0 ? (
            filteredSites.map((site) => {
              const manager = managerLookup.get(site.id);
              return (
                <View key={site.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
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
                      <Text className="text-lg font-bold mb-1">{site.name}</Text>
                      <Text className="text-sm text-gray-600 mb-2">{site.address}</Text>

                      <View className="mb-3">
                        <Text className="text-sm text-gray-500">Contact</Text>
                        <Text className="text-base text-gray-800 font-medium">{manager?.user?.name || '—'}</Text>
                        <Text className="text-xs text-gray-500 mt-1">{site.contactNumber}</Text>
                      </View>

                      <View className="flex-row items-center justify-between">
                        <View>
                          <Text className="text-sm text-gray-500">Capacity</Text>
                          <Text className="text-base text-gray-800">{site.capacity ? `${site.capacity} people` : '—'}</Text>
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
              );
            })
          ) : (
            <View className="flex-1 justify-center items-center py-10">
              <View className="bg-white rounded-xl p-6 shadow-sm">
                <Text className="text-gray-500 text-base text-center">No evacuation sites available right now.</Text>
                <Text className="text-gray-400 text-sm text-center mt-3">Tap + to add a new site.</Text>
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
