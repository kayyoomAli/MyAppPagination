import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/photos';
const ITEMS_PER_PAGE = 10;

const PaginationOtimize: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isEnd, setIsEnd] = useState(false);

  const fetchData = async (query = '') => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      const filteredData = response.data.filter(
        (item: any) =>
          item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1,
      );
      setData(filteredData);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (text: any) => {
    setQuery(text);
    setPage(1);
    fetchData(text);
  };

  const handleLoadMore = async () => {
    if (isLoading || isEnd) return;
    setIsLoading(true);
    setPage(page + 1);
    try {
      const response = await axios.get(API_URL);
      const filteredData = response.data
        .filter(
          (item: any) =>
            item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1,
        )
        .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
      if (filteredData.length > 0) {
        setData([...data, ...filteredData]);
        setIsLoading(false);
      } else {
        setIsEnd(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({item}: {item: any}) => (
    <View style={styles.item}>
      <Text>{item.title}</Text>
    </View>
  );

  const renderFooter = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    if (!isEnd) {
      return (
        <TouchableOpacity
          style={styles.loadMoreContainer}
          onPress={handleLoadMore}>
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.endContainer}>
        <Text style={styles.endText}>End of List</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={query}
        onChangeText={handleSearch}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    width: '90%',
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#f9c2ff',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  loadMoreContainer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  loadMoreText: {
    fontSize: 18,
    color: '#666',
  },
  endContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  endText: {
    fontSize: 18,
    color: '#666',
  },
});

export default PaginationOtimize;
