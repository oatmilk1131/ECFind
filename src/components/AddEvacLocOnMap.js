import polyline from '@mapbox/polyline';
import Constants from 'expo-constants';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { 
  ActivityIndicator, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated,
  TextInput,
  Keyboard,
  FlatList,
  Alert,
} from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { LocationContext } from '../LocationContext';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

function InputAutocomplete({
  label,
  placeholder,
  apiKey,
  onPlaceSelected,
}) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const fetchPredictions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&key=${apiKey}`;
      const res = await fetch(url);
      const json = await res.json();
      const preds = (json.predictions || []).map((p) => ({
        description: p.description,
        place_id: p.place_id,
      }));
      setSuggestions(preds);
    } catch (e) {
      console.warn('Place autocomplete error', e);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaceDetails = async (place_id) => {
    setLoading(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
        place_id
      )}&fields=geometry,name,formatted_address&key=${apiKey}`;
      const res = await fetch(url);
      const json = await res.json();
      return json.result || null;
    } catch (e) {
      console.warn('Place details error', e);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    // debounce to reduce requests
    debounceRef.current = setTimeout(() => {
      fetchPredictions(value);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value]);

  const handleSelect = async (place_id) => {
    Keyboard.dismiss();
    const details = await fetchPlaceDetails(place_id);
    setValue(details?.name || '');
    setSuggestions([]);
    onPlaceSelected(details ?? null);
  };

  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ marginBottom: 4 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder || ""}
        style={[styles.input, { padding: 8 }]}
        placeholderTextColor="#999"
        accessible
      />
      {loading && <ActivityIndicator size="small" color="#666" style={{ marginTop: 8 }} />}
      {suggestions.length > 0 && (
        <View style={{ maxHeight: 180, backgroundColor: 'white', borderRadius: 6, marginTop: 8 }}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}
                onPress={() => handleSelect(item.place_id)}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const getDirections = async (startLoc, destinationLoc, apiKey) => {
  try {
    let resp = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}&key=${apiKey}`
    );
    let respJson = await resp.json();
    if (respJson.routes.length === 0) return [];
    let points = polyline.decode(respJson.routes[0].overview_polyline.points);
    let coords = points.map((point) => {
      return {
        latitude: point[0],
        longitude: point[1],
      };
    });
    return coords;
  } catch (error) {
    console.error("Error fetching directions:", error);
    return [];
  }
};

const AddEvacLocOnMap = ({ instruction, onLocationSelected, initialCoordinate }) => {
  const ctx = useContext(LocationContext) || {};
  const location = ctx.location;
  const requestPermission = ctx.requestPermission;
  const error = ctx.error;
  const [marker, setMarker] = useState(initialCoordinate ?? null);
  const [closeDirectionsButtonAppear, setCloseDirectionsButtonAppear] = useState(false);
  const [directionsPressed, setDirectionsPressed] = useState(false);
  const [markerPressed, setMarkerPressed] = useState(false);
  // use safe area insets instead of useBottomTabBarHeight to avoid runtime error
  const insets = useSafeAreaInsets();
  const tabBarHeight = insets?.bottom ?? 0;
  const navigation = useNavigation();
  const [routeCoords, setRouteCoords] = useState([]);
  const [directionsAppear, setDirectionsAppear] = useState(false);
  const GOOGLE_API_KEY = "AIzaSyArypYkCth68zaG3PBYQJ_4P5mlD8jgsCQ";
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const mapRef = useRef(null);
  const [searchPressed, setSearchPressed] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  // guard to avoid map onPress clearing selection immediately after marker press
  const lastMarkerPressRef = useRef(0);
  // ignore map presses until this timestamp (ms) after a marker press
  const ignoreMapPressUntil = useRef(0);

  const handleMapPress = (event) => {
    if (!event?.nativeEvent?.coordinate) return;
    setMarker(event.nativeEvent.coordinate);
  };

  const handleConfirmPress = () => {
    if (!marker) {
      Alert.alert('Select Location', 'Tap on the map to choose a location first.');
      return;
    }
    if (typeof onLocationSelected === 'function') {
      onLocationSelected(marker);
    } else {
      navigation.navigate('EvacSiteDetails', { coordinate: marker });
    }
  };

  const moveTo = async (position) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  useEffect(() => {
    if (initialCoordinate) {
      setMarker(initialCoordinate);
      moveTo(initialCoordinate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCoordinate?.latitude, initialCoordinate?.longitude]);

  const onPlaceSelected = (details, flag) => {
    // guard if geometry/location missing
    const lat = details?.geometry?.location?.lat;
    const lng = details?.geometry?.location?.lng;
    if (lat == null || lng == null) {
      console.warn('Place details missing geometry/location', details);
      return;
    }

    const set = flag === "origin" ? setOrigin : setDestination;
    const position = {
      latitude: lat,
      longitude: lng,
    };
    set(position);
    moveTo(position);
  }
  
const handleSearchIconPress = () => {
    setSearchPressed(!searchPressed);
    Animated.timing(slideAnim, {
      toValue: searchPressed ? -100 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  if (!location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 8 }}>{error ?? 'Getting your location...'}</Text>
        {typeof requestPermission === 'function' && (
          <TouchableOpacity
            onPress={requestPermission}
            style={{ marginTop: 12, paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#007AFF', borderRadius: 8 }}
          >
            <Text style={{ color: 'white' }}>Retry location</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  

  return (
    <View style={styles.container}>
      {instruction && (
        <View style={styles.instructionBanner}>
          <Text style={styles.instructionText}>{instruction}</Text>
        </View>
      )}
      <MapView
        ref={mapRef}
        onPress={(event) => {
          if (searchPressed) {
            Animated.timing(slideAnim, {
              toValue: -100,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              setSearchPressed(false);
            });
            return;
          }
          handleMapPress(event);
        }}
        style={styles.mapView}
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.3,
          longitudeDelta: 0.2
        }}
        showsUserLocation={true}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      

      {marker && (
        <View className="absolute bottom-0 left-0 right-0 flex-row justify-between p-4">
        <TouchableOpacity
          className="flex-1 mr-2 bg-gray-200 rounded-lg py-3 items-center"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-gray-800 font-semibold">CANCEL</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 ml-2 bg-blue-500 rounded-lg py-3 items-center"
          onPress={handleConfirmPress}
        >
          <Text className="text-white font-semibold">OK</Text>
        </TouchableOpacity>
      </View>
      )}

      <TouchableOpacity 
        activeOpacity={0.5}
        onPress={handleSearchIconPress}
        style={styles.searchIconContainer}
      >
        <MagnifyingGlassIcon 
          style={styles.searchIcon}
          width={30}
        />
      </TouchableOpacity>

      {searchPressed && (
        <Animated.View 
          pointerEvents={searchPressed ? 'auto' : 'none'}
          style={[
            styles.searchContainer,
            {transform: [{translateY: slideAnim}]}
          ]}
        >
          <InputAutocomplete
            label="Location"  
            apiKey={GOOGLE_API_KEY}
            onPlaceSelected={(details) => onPlaceSelected(details, "origin")}
          />
        </Animated.View>
      )}
    </View>
  );
}

export default AddEvacLocOnMap;

const styles = StyleSheet.create({
  searchIcon: {
    position: "absolute",
    alignSelf: "center",
    marginTop: 8,
  },
  searchIconContainer: {
    position: "absolute",
    top: 15,
    width: 40,
    height: 40,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 20,
    marginLeft: 20,
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    alignSelf: "center",
    borderRadius: 8,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
  closeDirectionsButtonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  mapView: {
    // removed bottom: -20 to avoid overlapping the bottom area
    flex: 1,
    width: '100%',
  },
    paragraph: {
      fontSize: 18,
      textAlign: 'center'
    },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionBanner: {
    position: 'absolute',
    top: Constants.statusBarHeight + 10,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 10,
  },
  instructionText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
})
