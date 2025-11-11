import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { loadSiteManagers, loadEvacuationSites } from '../utils/dataService';
import styles from '../styles/styles';

export default function ChangeSiteManagerScreen({ setCurrentScreen }) {
  const [managers, setManagers] = useState([]);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const managersData = loadSiteManagers();
    const sitesData = loadEvacuationSites();
    setManagers(managersData.managers);
    setSites(sitesData.sites);
  }, []);

  const getSiteName = (siteId) => {
    const site = sites.find((s) => s.id === siteId);
    return site ? site.name : 'Unknown Site';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Site Managers</Text>
      <FlatList
        data={managers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.managerCard}>
            <Text style={styles.managerName}>{item.name}</Text>
            <Text style={styles.managerEmail}>{item.email}</Text>
            <Text style={styles.managerPhone}>{item.phone}</Text>
            <Text style={styles.managedSite}>Site: {getSiteName(item.siteId)}</Text>
            <Text style={[styles.managerStatus, { color: item.status === 'active' ? 'green' : 'red' }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}



