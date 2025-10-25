import {View, Text, TouchableOpacity} from 'react-native';
import { PencilSquareIcon } from 'react-native-heroicons/solid';
import StyleTextInput from './StyleTextInput';
import StyleButton from './StyleButton';

export default function PofileEditCard ({ 
    label, value, onPress, isPassword = false, 
    onSave, onCancel, fieldKey, isEditing, 
    tempValue, setTempValue}){
    
    const displayValue = isPassword ? '********' : value;
    const keyboardType = fieldKey === 'contact' ? 'numeric' : 'default';

    return (
        <View 
            className="bg-gray-200 rounded-xl p-4 mx-4 mb-5 border-2 border-custom-orange"
            style={{
                shadowColor: 'rgba(0,0,0,0.2',
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.3,
            }}
        >
            <View className="flex-row justify-between items-center">
            
                {isEditing ? (
                    <View className="flex-1 flex-row items-center mr-2">
                        <StyleTextInput
                            value={tempValue}
                            onChangeText={setTempValue}
                            placeholder={`Enter new ${label}`}
                            keyboardType={keyboardType}
                            className="border p-2 flex-1 mr-2"
                            secureTextEntry={isPassword}
                        />
                        <StyleButton title="Save" onPress={() => onSave(fieldKey)} className="py-1 px-3 text-sm" />
                        <StyleButton title="X" onPress={onCancel} className="ml-1 py-1 px-3 text-sm bg-red-500" />
                    </View>

                ) : (
                    <>
                        <View className="flex-1 mr-4">
                            <Text className="text-gray-600 text-sm font-medium mb-1">{label}</Text>
                            <Text className="text-black text-lg font-bold">{displayValue}</Text>
                        </View>

                        <TouchableOpacity onPress={onPress} className="p-2">
                            <PencilSquareIcon color="#333" size={24} />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );


};

