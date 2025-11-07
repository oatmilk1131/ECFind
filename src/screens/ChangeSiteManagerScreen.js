import { Text, View, TouchableOpacity, FlatList} from 'react-native'
import React, { useState } from 'react';
import Icon from '../components/Icon';
import styles from '../styles/styles'
import Dropdown from '../components/Dropdown';

export default function ChangeSiteManagerScreen ({ setCurrentScreen })
{
    const options = [
    { label: "Option 1", value: 1 },
    { label: "Option 2", value: 2 },
    { label: "Option 3", value: 3 },
  ];

    const users = [

    ];
    
      const initialSites = [
        'Site 1 - Main Evacuation Center',
        'Site 2 - Community Hall',
        'Site 3 - School Gym',
        'Site 4 - Sports Complex',
        'Site 5 - Public Library',
        'Site 6 - Park Pavilion',
        'Site 7 - Emergency Shelter',
        'Site 8 - Community Center',
        'Site 9 - High School Auditorium',
        'Site 10 - Municipal Building'
      ];

      const [sites, setSites] = useState(initialSites);

  return (

 <View style={styles.container}>
      <View style={styles.lowerHeader}>
        <Text style={styles.title}>Change Site Manager</Text>
        <View style={styles.line} />
        </View>

        <FlatList
        data={sites}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={[styles.listItem, {position: 'relative'}]}>
            <Text style={styles.listText}>{item}</Text>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
  <Dropdown
    data={options}
    onSelect={(item) => console.log("Selected:", item)}
  />
</View>
          </View>
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        />


        <View>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('DeveloperMenu')}>
          <Text style={styles.backText}>Return to menu</Text>
        </TouchableOpacity>
        </View>
    </View>

  )
}



