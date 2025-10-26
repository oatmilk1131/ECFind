import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

const DeleteConfirmationModal = ({ visible, siteToDelete, onConfirm, onCancel }) => (
  <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onCancel}>
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <View style={{ width: '100%', maxWidth: 420, backgroundColor: 'white', borderRadius: 12, padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Delete Confirmation</Text>
        <Text style={{ color: '#444', marginBottom: 16 }}>Are you sure you want to delete "{siteToDelete}"?</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={onCancel} style={{ paddingVertical: 8, paddingHorizontal: 12, marginRight: 8, borderRadius: 6, backgroundColor: '#e5e7eb' }}>
            <Text style={{ color: '#111' }}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, backgroundColor: '#ef4444' }}>
            <Text style={{ color: 'white' }}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default DeleteConfirmationModal;