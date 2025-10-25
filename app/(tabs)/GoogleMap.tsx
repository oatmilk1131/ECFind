import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Button } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE, LatLng, Callout, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import polyline from '@mapbox/polyline';
import Constants from 'expo-constants'; 
import { LocationContext } from '../LocationContext';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

    import { decode } from "@mapbox/polyline";

    const getDirections = async (startLoc: LatLng, destinationLoc: LatLng, apiKey: string): Promise<LatLng[]> => {
      try {
        let resp = await fetch(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc.latitude},${startLoc.longitude}&destination=${destinationLoc.latitude},${destinationLoc.longitude}&key=${apiKey}`
        );
        let respJson = await resp.json();
        if (respJson.routes.length === 0) return [];
        let points = decode(respJson.routes[0].overview_polyline.points);
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

const GoogleMap = () => {
  const [selectedMarker, setSelectedMarker] = useState<LatLng | null>(null);
  const location = useContext(LocationContext);
  const [closeDirectionsButtonAppear, setCloseDirectionsButtonAppear] = useState<boolean>(false);
  const [directionsPressed, setDirectionsPressed] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null); 
  const [markerPressed, setMarkerPressed] = useState<boolean>(false);
  const tabBarHeight = useBottomTabBarHeight();
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [directionsAppear, setDirectionsAppear] = useState<boolean>(false);
  const GOOGLE_API_KEY = "AIzaSyArypYkCth68zaG3PBYQJ_4P5mlD8jgsCQ";
  useEffect(() => {
    const fetchRoute = async () => {
      if (!location?.coords) return;
      if (!selectedMarker) return;

      const origin = {latitude: location?.coords.latitude, longitude: location?.coords.longitude}
      const destination = {latitude: selectedMarker?.latitude, longitude: selectedMarker?.longitude}
      const coords = await getDirections(origin, destination, GOOGLE_API_KEY,);
      setRouteCoords(coords);
    };
    fetchRoute();
  }, [directionsPressed]);
  
    if (!location) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text>{errorMsg ?? 'Getting your location...'}</Text>
        </View>
      );
    }

     const handleMarkerPress = (coordinate: LatLng) => {
      setSelectedMarker(coordinate);
      setMarkerPressed(true);
  };

  const handleCloseDirectionsPress = () => {
    setCloseDirectionsButtonAppear(false);
    setDirectionsAppear(false);
  }


  const handleButtonPress = () => {
    console.log('Button pressed after marker!');
    setMarkerPressed(false);
    setDirectionsAppear(true);
    setCloseDirectionsButtonAppear(true);
    setDirectionsPressed(!directionsPressed);
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
      onPress={()=>setMarkerPressed(false)}
      style = {styles.mapView}
      region = {{
        latitude: location.coords.latitude, 
        longitude: location.coords.longitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.2
      }}
      showsUserLocation = {true}
      >
        
        <Marker
          coordinate={{
            latitude: 14.649102416560252,
            longitude: 121.04385011188928
          }}
          onPress={()=> handleMarkerPress({
            latitude: 14.649102416560252,
            longitude: 121.04385011188928
          })}
        >
          <Callout />
        </Marker>
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
    {markerPressed && (
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

export default GoogleMap

const styles = StyleSheet.create({
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
    flex:1
  },
    mapView: {
        top: Constants.statusBarHeight,
        bottom: -20,
        flex: 1
    },
    paragraph: {
      fontSize: 18,
      textAlign: 'center'
    },
    loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})