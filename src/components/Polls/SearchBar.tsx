import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#8D8D8D" style={styles.icon} />
      <TextInput
        style={styles.input}
        value={searchValue}
        onChangeText={setSearchValue}
        placeholder="Search for an event  . . ."
        placeholderTextColor="#8b8b8b"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    backgroundColor: 'white',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#818181',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginHorizontal: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
});

export default SearchBar;

