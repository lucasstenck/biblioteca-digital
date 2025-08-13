import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,

} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { bookService } from '../services/api';
import { Book, BooksResponse, RootStackParamList, ApiResponse } from '../types';

type BooksScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;



export const BooksScreen: React.FC = () => {
  const navigation = useNavigation<BooksScreenNavigationProp>();
  
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadBooks(1);
  }, []);

  const loadBooks = async (page: number, append: boolean = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response: ApiResponse<BooksResponse> = await bookService.getAllBooks(page, 5);
      
      if (response.success && response.data) {
        const { books: newBooks, pagination: newPagination } = response.data;
        
        if (append) {
          setBooks(prev => [...prev, ...newBooks]);
        } else {
          setBooks(newBooks);
        }
        
        setPagination(newPagination);
      }
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBooks(1);
    setRefreshing(false);
  };

  const loadMoreBooks = () => {
    if (pagination.hasNext && !loadingMore) {
      loadBooks(pagination.currentPage + 1, true);
    }
  };

  const handleBookPress = (bookId: number) => {
    navigation.navigate('BookDetail', { bookId });
  };

  const handlePagePress = (page: number) => {
    if (page !== pagination.currentPage) {
      loadBooks(page);
    }
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => handleBookPress(item.id)}
    >
      <Image
        source={{ uri: item.image_url }}
        style={styles.bookCover}
        resizeMode="contain"
        onError={(error) => console.log('Erro ao carregar imagem:', error.nativeEvent.error)}
        key={`${item.id}_${Date.now()}`}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.short_description}
        </Text>
        <Text style={styles.bookDescription} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.bookMeta}>
          <Text style={styles.bookCategory}>Desenvolvimento Pessoal</Text>
          <Text style={styles.bookDownloads}>
            Disponível para download
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.pageButton,
            i === pagination.currentPage && styles.activePageButton,
          ]}
          onPress={() => handlePagePress(i)}
        >
          <Text
            style={[
              styles.pageButtonText,
              i === pagination.currentPage && styles.activePageButtonText,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.paginationContainer}>
        {pagination.hasPrev && (
          <TouchableOpacity
            style={styles.pageButton}
            onPress={() => handlePagePress(pagination.currentPage - 1)}
          >
            <Text style={styles.pageButtonText}>‹</Text>
          </TouchableOpacity>
        )}

        {pages}

        {pagination.hasNext && (
          <TouchableOpacity
            style={styles.pageButton}
            onPress={() => handlePagePress(pagination.currentPage + 1)}
          >
            <Text style={styles.pageButtonText}>›</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#667eea" />
        <Text style={styles.loadingFooterText}>Carregando mais livros...</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Carregando biblioteca...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Biblioteca de Livros</Text>
        <Text style={styles.headerSubtitle}>
          {pagination.totalBooks} livros disponíveis
        </Text>
      </View>

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMoreBooks}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      {pagination.totalPages > 1 && renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#000000',
  },
  listContainer: {
    padding: 20,
  },
  bookCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  bookCover: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f9fa',
  },
  bookInfo: {
    padding: 20,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 24,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 10,
    fontWeight: '500',
  },
  bookDescription: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
    marginBottom: 15,
  },
  bookMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookCategory: {
    fontSize: 12,
    color: '#ffffff',
    backgroundColor: '#ff0000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
  },
  bookDownloads: {
    fontSize: 12,
    color: '#000000',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  pageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activePageButton: {
    backgroundColor: '#ff0000',
    borderColor: '#ff0000',
  },
  pageButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  activePageButtonText: {
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#000000',
    marginTop: 15,
  },
  loadingFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingFooterText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 10,
  },
});
