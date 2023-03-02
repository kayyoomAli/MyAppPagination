import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Image,
} from 'react-native';
import axios from 'axios';
import {useRef} from 'react';
import {debounce} from 'lodash';

interface Item {
  id: number;
  title: string;
}

const API_URL = 'https://jsonplaceholder.typicode.com/photos';
const ITEMS_PER_PAGE = 10;

const PaginationOtimizeWithType: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isEnd, setIsEnd] = useState(false);
  const yourRef = useRef<any>(null);
  // console.log('first', data);
  const fetchData = async (query = '') => {
    setIsLoading(true);
    try {
      const response = await axios.get<Item[]>(API_URL);
      const filteredData = response.data.filter(
        item => item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1,
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

  const handleSearch = (text: string) => {
    setQuery(text);
    setPage(1);
    fetchData(text);
  };
  // const handler = useCallback(debounce(handleSearch, 2000), []);

  const onPressFunction = () => {
    yourRef.current?.scrollToEnd();
  };

  const onPressFunctionGotoToTop = () => {
    yourRef.current?.scrollToIndex({index: 0});
  };
  const handleLoadMore = async () => {
    if (isLoading || isEnd) return;
    setIsLoading(true);
    setPage(page + 1);
    try {
      const response = await axios.get<Item[]>(API_URL);
      const filteredData = response.data
        .filter(
          item => item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1,
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

  const renderItem = ({item}: {item: Item}) => (
    <View style={styles.item}>
      <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
        {item.id}
        {': '} {item.title.slice(0, 30)}
      </Text>
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
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {
                <View style={{flexDirection: 'row'}}>
          <Image
            style={{
              height: 20,
              width: 20,
              position: 'absolute',
              top: 20,
              left: 45,
            }}
            source={require('../assets/search.png')}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={query}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
            onPress={() => {
              setQuery(''), fetchData();
            }}>
            {query.length > 0 ? (
              <Image
                style={{
                  height: 20,
                  width: 20,
                  position: 'absolute',
                  top: 20,
                  right: 45,
                }}
                source={require('../assets/cross.png')}
              />
            ) : null}
          </TouchableOpacity>
        </View>
        }
  
        <Pressable
          style={[
            styles.button,
            {
              top: 60,
              zIndex: 1,
              transform: [
                {
                  rotate: '180deg',
                },
              ],
            },
          ]}
          onPress={onPressFunctionGotoToTop}>
          <Text style={styles.arrow}>v</Text>
        </Pressable>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ref={yourRef}
            refreshing={true}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={() => {
              return (
                <View>
                  <Text>{'Empty data'}</Text>
                </View>
              );
            }}
          />
        )}
        <Pressable style={styles.button} onPress={onPressFunction}>
          <Text style={styles.arrow}>v</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  arrow: {
    fontSize: 36,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 38,
    marginHorizontal: 35,
    width: '80%',
    marginVertical: 10,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: 'dodgerblue',
    borderRadius: 8,
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

export default PaginationOtimizeWithType;
// {onPressSearch ? (
//   <View style={{flexDirection: 'row'}}>
//     <Image
//       style={{
//         height: 20,
//         width: 20,
//         position: 'absolute',
//         top: 20,
//         left: 45,
//       }}
//       source={require('../assets/search.png')}
//     />
//     <TextInput
//       style={styles.searchInput}
//       placeholder="Search..."
//       value={query}
//       onChangeText={handleSearch}
//     />
//     <TouchableOpacity
//       onPress={() => {
//         setQuery(''), fetchData();
//       }}>
//       {query.length > 0 ? (
//         <Image
//           style={{
//             height: 20,
//             width: 20,
//             position: 'absolute',
//             top: 20,
//             right: 45,
//           }}
//           source={require('../assets/cross.png')}
//         />
//       ) : null}
//     </TouchableOpacity>
//   </View>
// ) : (
//   <TouchableOpacity onPress={() => {setonPressSearch(!onPressSearch)}}>
//     <Image
//       style={{
//         height: 20,
//         width: 20,
//         // position: 'absolute',
//         // top: 20,
//         // right: 45,
//       }}
//       source={require('../assets/search.png')}
//     />
//   </TouchableOpacity>
// )}