import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { loadEvacuationSites, updateSiteStatus } from '../utils/dataService';
import styles from '../styles/styles';
import StyleButton from '../components/StyleButton';
import { useAuth } from '../context/Auth';
import { useFocusEffect } from '@react-navigation/native';

const EvacuationSitesScreen = ({ navigation, route }) => {
  const [sites, setSites] = useState([]);
  const { user } = useAuth();
  const canManage = ['manager', 'admin'].includes(user?.role);

  useEffect(() => {
    const data = loadEvacuationSites();
    setSites(data.sites);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const data = loadEvacuationSites();
      setSites(data.sites ?? []);
    }, [])
  );

  const mergeSite = (incoming) => {
    if (!incoming) return;
    setSites((prev) => {
      const existingIndex = prev.findIndex((site) => site.id === incoming.id);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], ...incoming };
        return next;
      }
      return [...prev, incoming];
    });
  };

  useEffect(() => {
    if (!route?.params?.timestamp) return;
    if (route.params.newSite) {
      mergeSite(route.params.newSite);
    }
    if (route.params.updatedSite) {
      mergeSite(route.params.updatedSite);
    }
    navigation.setParams({ newSite: undefined, updatedSite: undefined, timestamp: undefined });
  }, [route?.params?.timestamp, route?.params?.newSite, route?.params?.updatedSite, navigation]);

  const handleSitePress = (site) => {
    navigation.navigate('EvacSiteDetails', { site });
  };

  const handleToggleStatus = (site) => {
    const nextStatus = site.status === 'active' ? 'standby' : 'active';
    const updated = updateSiteStatus(site.id, nextStatus);
    mergeSite(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evacuation Sites</Text>
      <FlatList
        data={sites}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          canManage ? (
            <StyleButton
              title="Add Evacuation Site"
              onPress={() => navigation.navigate('AddEvacuationSite')}
              className="py-3 px-5 w-full items-center"
            />
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.siteCard}
            onPress={() => handleSitePress(item)}
          >
            <Text style={styles.siteName}>{item.name}</Text>
            <Text style={styles.siteAddress}>{item.address}</Text>
            <Text style={styles.siteCapacity}>
              Capacity: {item.maxCapacity ?? item.capacity ?? '—'} people
            </Text>
            <Text style={styles.siteSlots}>
              Slots Available: {item.slotsAvailable ?? '—'}
            </Text>
            <Text style={[styles.siteStatus, { color: item.status === 'active' ? 'green' : 'red' }]}>
              {item.status.toUpperCase()}
            </Text>
            {canManage && (
              <StyleButton
                title={`Set ${item.status === 'active' ? 'Standby' : 'Active'}`}
                onPress={() => handleToggleStatus(item)}
                className="mt-2 py-2"
              />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default EvacuationSitesScreen;
