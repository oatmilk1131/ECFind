import polyline from '@mapbox/polyline';
import Constants from 'expo-constants';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View, Text, TouchableOpacity, Animated, StyleSheet, TextInput, Keyboard, FlatList, Image } from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import { LocationContext } from '../LocationContext';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
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

const GoogleMap = ({ onMarkerPress, sites = [], selectedSite = null, directionsRequestId = 0 }) => {
  const ctx = useContext(LocationContext) || {};
  const location = ctx.location;
  const requestPermission = ctx.requestPermission;
  const error = ctx.error;
  const [closeDirectionsButtonAppear, setCloseDirectionsButtonAppear] = useState(false);
  const [directionsSignal, setDirectionsSignal] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null); 
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

  const moveTo = async (position) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  useEffect(() => {
    if (selectedSite) {
      moveTo({ latitude: selectedSite.latitude, longitude: selectedSite.longitude });
    }
  }, [selectedSite]);

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
  useEffect(() => {
    const fetchRoute = async () => {
      if (!location?.coords || !selectedSite || directionsSignal === 0) return;

      const origin = { latitude: location.coords.latitude, longitude: location.coords.longitude };
      const destination = { latitude: selectedSite.latitude, longitude: selectedSite.longitude };
      const coords = await getDirections(origin, destination, GOOGLE_API_KEY);
      setRouteCoords(coords);
    };
    fetchRoute();
  }, [directionsSignal, selectedSite, location?.coords]);

  useEffect(() => {
    if (!selectedSite) {
      setDirectionsAppear(false);
      setCloseDirectionsButtonAppear(false);
      setRouteCoords([]);
    }
  }, [selectedSite]);

  useEffect(() => {
    if (!selectedSite || directionsRequestId === 0) return;
    setDirectionsAppear(true);
    setCloseDirectionsButtonAppear(true);
    setDirectionsSignal((prev) => prev + 1);
  }, [directionsRequestId, selectedSite]);
  
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

     const handleMarkerPress = (site) => {
      lastMarkerPressRef.current = Date.now();
      // ignore any subsequent map presses for 800ms to avoid MapView onPress clearing selection
      ignoreMapPressUntil.current = Date.now() + 800;
      if (typeof onMarkerPress === 'function') {
        onMarkerPress(site);
      }
  };

  const handleCloseDirectionsPress = () => {
    setCloseDirectionsButtonAppear(false);
    setDirectionsAppear(false);
    setRouteCoords([]);
  }

  const handleSearchIconPress = () => {
    setSearchPressed(!searchPressed);
    Animated.timing(slideAnim, {
      toValue: searchPressed ? -100 : 50,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }


  const handleButtonPress = () => {
    if (!selectedSite) return;
    setDirectionsAppear(true);
    setCloseDirectionsButtonAppear(true);
    setDirectionsSignal((prev) => prev + 1);
  };

    let text = 'Waiting for location...'; 
    if (errorMsg) { 
      text = errorMsg; 
    } else if (location) { 
      text = JSON.stringify(location); 
    }
  return (
    <View style={styles.container}>
     <MapView
       ref={mapRef}
       onPress={()=>{

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

         // ignore map presses that occur within the ignore window after a marker press
         const now = Date.now();
         if (now < ignoreMapPressUntil.current) {
           return;
         }

         // only clear selection if there is a selected marker
         if (selectedSite && typeof onMarkerPress === 'function') {
           onMarkerPress(null);
         }
       }}
       style = {styles.mapView}
       region = {{
         latitude: location.coords.latitude, 
         longitude: location.coords.longitude,
         latitudeDelta: 0.3,
         longitudeDelta: 0.2
       }}
       showsUserLocation = {true}
       >
        
        {sites.map((site) => (
          <Marker
            key={site.id}
            coordinate={{
              latitude: site.latitude,
              longitude: site.longitude,
            }}
            onPress={() => handleMarkerPress(site)}
          >
            <Image source={require('../assets/images/house.png')} style={styles.siteMarker} />
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{site.name}</Text>
                <Text style={styles.calloutSubtitle}>{site.address}</Text>
                {site.images?.length > 0 && (
                  <Image source={{ uri: site.images[0] }} style={styles.calloutImage} />
                )}
              </View>
            </Callout>
          </Marker>
        ))}
        {(routeCoords.length > 0 && directionsAppear) && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor= "blue"
          >
          </Polyline>
        )
        }

    </MapView>
    <View style={{ position:'absolute', top: Constants.statusBarHeight + Constants.statusBarHeight, width: '100%',
            marginLeft: 8
           }}
            className="flex-row items-center px-4 py-3">
            <TouchableOpacity 
              className="p-2 bg-yellow-300 rounded-full"
              onPress={() => navigation.navigate('UserProfile')}
            >
              <Text className="text-xl">👤</Text>
            </TouchableOpacity>
            <View className="flex-1" />
          </View>
    
    <TouchableOpacity 
    activeOpacity={0.5}
    onPress={handleSearchIconPress}
    style={styles.searchIconContainer}>
        <MagnifyingGlassIcon style={styles.searchIcon}
        
        
        width={30}
        />
      </TouchableOpacity>


    { searchPressed && (
        
    <Animated.View 
      pointerEvents={searchPressed ? 'auto' : 'none'}
      style = {[styles.searchContainer,
      {transform: [{ translateY: slideAnim }]}]}>

      <InputAutocomplete
          label="Location"  
          apiKey={GOOGLE_API_KEY}
          onPlaceSelected={(details) => onPlaceSelected(details, "origin")}
        />
  
    </Animated.View>
    )}
    
    

    {!!selectedSite && (
      <View style = {styles.buttonContainer}>
        <TouchableOpacity style= {styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>
            Get Directions
          </Text>
        </TouchableOpacity>
      </View>
    )}
    {closeDirectionsButtonAppear && (
      <View style = {styles.closeDirectionsButtonContainer}>
        <TouchableOpacity style = {styles.button} onPress={handleCloseDirectionsPress}>
          <Text style={styles.buttonText}>
            Close Directions
          </Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
  )
}

export default GoogleMap;

const styles = StyleSheet.create({
  searchIcon: {
    position: "absolute",
    alignSelf: "center",
    marginTop: 8,
  },
  searchIconContainer: {
    position: "absolute",
    top: Constants.statusBarHeight + 10,
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
    paddingTop: Constants.statusBarHeight, // ensure map sits below status bar
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
  callout: {
    maxWidth: 220,
  },
  calloutTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  calloutSubtitle: {
    fontSize: 12,
    color: '#4b5563',
  },
  calloutImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginTop: 6,
  },
  siteMarker: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});
