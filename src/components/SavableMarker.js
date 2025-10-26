import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function SavableMarker() {
  const [marker, setMarker] = useState(null);
  const [confirmPressed, setConfirmPressed] = useState(false);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarker(coordinate);
  };

  const handleConfirmPress = () => {
    setConfirmPressed(true);
    setMarker(null);
    // add save logic here if needed (e.g. upload or persist the coordinate)
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 14.649102416560252,
          longitude: 121.04385011188928,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
        showsUserLocation={true}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      {marker && (
        <View>
          <Text style={styles.coords}>
            Lat: {marker.latitude.toFixed(5)} | Lng: {marker.longitude.toFixed(5)}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleConfirmPress}>
              <Text style={styles.buttonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  map: {
    flex: 1,
  },
  coords: {
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#fff',
  },
});