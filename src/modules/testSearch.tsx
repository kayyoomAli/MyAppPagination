import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

interface Item {
  id: number;
  name: string;
  description: string;
}

const DummyData: Item[] = [
  {id: 1, name: 'Apple', description: 'A red fruit'},
  {id: 2, name: 'Banana', description: 'A yellow fruit'},
  {id: 3, name: 'Carrot', description: 'A orange vegetable'},
  {id: 4, name: 'Dog', description: 'A common pet'},
  {id: 5, name: 'Elephant', description: 'A large animal'},
];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);

  useEffect(() => {
    const filteredResults = DummyData.filter(item => {
      return (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setSearchResults(filteredResults);
  }, [searchTerm]);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
  };

  const renderItem = ({item}: {item: Item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <SafeAreaView> */}
      <TextInput
        style={styles.input}
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchTerm}
      />
      <FlatList
        style={styles.list}
        data={searchResults}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
      {/* </SafeAreaView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  itemDescription: {
    marginTop: 5,
  },
});

export default Search;
