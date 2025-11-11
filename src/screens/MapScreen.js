import React, { useCallback, useRef, useState } from 'react';
import { View, StatusBar, Dimensions, Animated, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import MapBackground from '../components/MapBackground';
import BottomSheet from '../components/BottomSheet';
import Header from '../components/Header';
import { loadEvacuationSites } from '../utils/dataService';
import { useFocusEffect } from '@react-navigation/native';

const BOTTOM_SHEET_MAX_HEIGHT = Dimensions.get('window').height * 0.8;
const BOTTOM_SHEET_MIN_HEIGHT = 180;

const MapScreen = ({ navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [sites, setSites] = useState([]);
  const bottomSheetHeight = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;

  useFocusEffect(
    useCallback(() => {
      const data = loadEvacuationSites();
      setSites(data.sites ?? []);
      if (selectedSite?.id) {
        const refreshed = data.sites?.find((site) => site.id === selectedSite.id);
        if (refreshed) {
          setSelectedSite(refreshed);
        }
      }
    }, [selectedSite?.id])
  );

  const expandBottomSheet = () => {
    setIsExpanded(true);
    Animated.spring(bottomSheetHeight, {
      toValue: BOTTOM_SHEET_MAX_HEIGHT,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  };

  const collapseBottomSheet = () => {
    setIsExpanded(false);
    Animated.spring(bottomSheetHeight, {
      toValue: BOTTOM_SHEET_MIN_HEIGHT,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  };

  const handleMarkerPress = (site) => {
    if (site) {
      setSelectedSite(site);
      expandBottomSheet();
    } else {
      setSelectedSite(null);
      collapseBottomSheet();
    }
  };

  const handleSiteCardPress = (site) => {
    setSelectedSite(site);
    expandBottomSheet();
  };

  const renderSiteCard = ({ item }) => (
    <TouchableOpacity style={sheetStyles.siteCard} onPress={() => handleSiteCardPress(item)}>
      <View style={sheetStyles.siteCardHeader}>
        <Text style={sheetStyles.siteName}>{item.name}</Text>
        <Text style={[sheetStyles.siteStatus, item.status === 'active' ? sheetStyles.statusActive : sheetStyles.statusInactive]}>
          {item.status}
        </Text>
      </View>
      <Text style={sheetStyles.siteAddress}>{item.address}</Text>
      <Text style={sheetStyles.siteMeta}>Capacity: {item.maxCapacity ?? item.capacity ?? '—'} people</Text>
      <Text style={sheetStyles.siteMeta}>Slots Available: {item.slotsAvailable ?? '—'}</Text>
    </TouchableOpacity>
  );

  const bottomSheetTitle = selectedSite ? selectedSite.name : 'Evacuation Sites';

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      <Header 
        title="Map View" 
        onBack={() => navigation.navigate('Home')} 
      />

      <MapBackground 
        sites={sites}
        selectedSite={selectedSite}
        onMarkerPress={handleMarkerPress}
      />

      <BottomSheet
        title={bottomSheetTitle}
        height={bottomSheetHeight}
        isExpanded={isExpanded}
        onExpand={expandBottomSheet}
        onCollapse={collapseBottomSheet}
        minHeight={BOTTOM_SHEET_MIN_HEIGHT}
        maxHeight={BOTTOM_SHEET_MAX_HEIGHT}
      >
        {selectedSite ? (
          <View>
            <Text style={sheetStyles.detailHeading}>Address</Text>
            <Text style={sheetStyles.detailValue}>{selectedSite.address}</Text>

            <Text style={sheetStyles.detailHeading}>Capacity</Text>
            <Text style={sheetStyles.detailValue}>
              {selectedSite.maxCapacity ?? selectedSite.capacity ?? '—'} people
            </Text>

            <Text style={sheetStyles.detailHeading}>Slots Available</Text>
            <Text style={sheetStyles.detailValue}>{selectedSite.slotsAvailable ?? '—'}</Text>

            <Text style={sheetStyles.detailHeading}>Site Contact</Text>
            <Text style={sheetStyles.detailValue}>
              {selectedSite.managerName ?? 'Not Assigned'}
            </Text>

            <Text style={sheetStyles.detailHeading}>Contact Number</Text>
            <Text style={sheetStyles.detailValue}>
              {selectedSite.contactNumber ?? '—'}
            </Text>

            <Text style={sheetStyles.detailHeading}>Status</Text>
            <Text
              style={[
                sheetStyles.detailValue,
                selectedSite.status === 'active' ? sheetStyles.statusActive : sheetStyles.statusInactive,
              ]}
            >
              {selectedSite.status.toUpperCase()}
            </Text>

            <TouchableOpacity style={sheetStyles.clearSelectionButton} onPress={() => setSelectedSite(null)}>
              <Text style={sheetStyles.clearSelectionText}>Back to list</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={sites}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderSiteCard}
            ListEmptyComponent={
              <Text style={sheetStyles.emptyText}>No evacuation sites available.</Text>
            }
            contentContainerStyle={sites.length === 0 ? sheetStyles.emptyContainer : null}
          />
        )}
      </BottomSheet>
    </View>
  );
};

const sheetStyles = StyleSheet.create({
  siteCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  siteCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    paddingRight: 8,
  },
  siteStatus: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statusActive: {
    color: '#15803d',
  },
  statusInactive: {
    color: '#dc2626',
  },
  siteAddress: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  siteMeta: {
    fontSize: 13,
    color: '#6b7280',
  },
  detailHeading: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#9ca3af',
    marginTop: 12,
  },
  detailValue: {
    fontSize: 16,
    color: '#111827',
    marginTop: 4,
  },
  clearSelectionButton: {
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f97316',
    alignItems: 'center',
  },
  clearSelectionText: {
    color: '#f97316',
    fontWeight: '600',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#6b7280',
  },
});

export default MapScreen;
