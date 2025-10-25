import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import MapView, { Marker, MapPressEvent, LatLng } from 'react-native-maps';
import GoogleMap from './GoogleMap';
import Constants from 'expo-constants'; 


const TouchableMap = () => {
    const [marker, setMarker] = useState<LatLng | null>(null);

    const handleMapPress = (event: MapPressEvent) => {
        const { coordinate } = event.nativeEvent;
        setMarker(coordinate);
    }

  return (
    <View style = {styles.container}>
        <MapView
            style = {styles.map}
            onPress = {handleMapPress}
            initialRegion={{
                latitude: 14.649102416560252, 
                longitude: 121.04385011188928,
                latitudeDelta: 0.2,
                longitudeDelta: 0.2
            }}
            showsUserLocation = {true}
            >
                {marker && <Marker coordinate = {marker}/>}
        </MapView>
        {marker && (
            <Text style = {styles.coords}>
                Lat: {marker.latitude.toFixed(5)} | Lng: {marker.longitude.toFixed(5)}
            </Text>
        )
        }
    </View>
  )
}

export default TouchableMap

const styles = StyleSheet.create({
    container: {
    flex: 1,
    },
    map: {
        top: Constants.statusBarHeight,
        flex: 1,
    },
    coords: {
        textAlign: 'center',
        padding: 8,
        backgroundColor: '#fff',
    }
}
)