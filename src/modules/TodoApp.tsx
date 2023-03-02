import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
} from 'react-native';
import React, {useState} from 'react';

/**
 * @Todo type
 * @description declare the type of variable
 */
interface Todo {
  id: string;
  task: string;
}

/**
 * @CustomTodoApp component
 * @description this will show the ui in screen
 */

const CustomTodoApp: React.FC = () => {
  const [search, setSearch] = useState('');
  const [newTodo, setNewTodo] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);

  /**
   * @filteredTodos function
   * @description search data in local
   */
  const filteredTodos = todos.filter(todo =>
    todo.task.toLowerCase().includes(search.toLowerCase()),
  );

  /**
   * @sortedTodos function
   * @description sorting data in ascending and descending
   */
  const sortedTodos = filteredTodos.sort((a, b) => {
    if (sort === 'asc') {
      return a.task.localeCompare(b.task);
    }
    return b.task.localeCompare(a.task);
  });

  /**
   * @handleAddTodo function
   * @description add data like id nad task to the array called todos
   */
  const handleAddTodo = () => {
    if (newTodo !== '') {
      setTodos([...todos, {id: Date.now().toString(), task: newTodo}]);
      setNewTodo('');
    }
  };

  /**
   * @handleEditTodo function
   * @description  handle editing item in flatlist
   */
  const handleEditTodo = (id: string, task: string) => {
    setEditingTodo({id, task});
  };

  /**
   * @sortedTodos function
   * @description after edit save to the array
   */
  const handleSaveTodo = (id: string, task: string) => {
    setTodos(todos.map(todo => (todo.id === id ? {id, task} : todo)));
    setEditingTodo(undefined);
  };

  /**
   * @sortedTodos function
   * @description delete the particular item from flatlist
   */
  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new to-do"
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sortContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Todos"
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <View style={[styles.inputContainer, {justifyContent: 'space-between'}]}>
        <TouchableOpacity
          disabled={!(todos.length > 1)}
          onPress={() => setSort('asc')}
          style={[styles.sortButton, {backgroundColor: '#4caf50'}]}>
          <Text style={styles.sortButtonText}>Asc</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSort('desc')}>
          <Text style={styles.sortButtonText}>Desc</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedTodos}
        renderItem={({index, item}) => (
          <View style={styles.todoContainer}>
            {editingTodo?.id === item.id ? (
              <>
                <TextInput
                  style={styles.todoInput}
                  value={editingTodo.task}
                  onChangeText={text =>
                    setEditingTodo({...editingTodo, task: text})
                  }
                />
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => handleSaveTodo(item.id, editingTodo.task)}>
                  <Text style={styles.editButtonText}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.todoId}>{index + 1}</Text>
                <Text style={styles.todoText}>{item.task}</Text>
                <View style={styles.todoActionsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditTodo(item.id, item.task)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTodo(item.id)}>
                    <Text style={styles.editButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
        keyExtractor={(item: any) => item.id}
      />
    </View>
  );
};

export default CustomTodoApp;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    marginTop: 60,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sortButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    marginVertical: 20,
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
  },
  todoId: {
    color: 'black',
  },
  todoText: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  todoInput: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  todoActionsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#4caf50',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 5,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    marginLeft: 5,
  },
  sortButton: {
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
});
