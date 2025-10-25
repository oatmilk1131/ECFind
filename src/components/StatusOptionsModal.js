import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from '../styles/styles';

const StatusOptionsModal = ({ visible, selectedStatus, onSelect, onClose }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Select Status</Text>
        
        <TouchableOpacity 
          style={[
            styles.statusOption,
            selectedStatus === 'Open' && styles.selectedStatusOption
          ]}
          onPress={() => onSelect('Open')}
        >
          <Text style={styles.statusOptionText}>Open</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.statusOption,
            selectedStatus === 'Abandoned' && styles.selectedStatusOption
          ]}
          onPress={() => onSelect('Abandoned')}
        >
          <Text style={styles.statusOptionText}>Abandoned</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.modalCloseButton}
          onPress={onClose}
        >
          <Text style={styles.modalCloseButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default StatusOptionsModal;