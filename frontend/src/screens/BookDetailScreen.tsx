import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,

  Linking,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as SecureStore from 'expo-secure-store';
import { bookService } from '../services/api';
import { Book, RootStackParamList } from '../types';

type BookDetailRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;
type BookDetailNavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;



export const BookDetailScreen: React.FC = () => {
  const route = useRoute<BookDetailRouteProp>();
  const navigation = useNavigation<BookDetailNavigationProp>();
  const { bookId } = route.params;
  
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    loadBookDetails();
  }, [bookId]);

  const loadBookDetails = async () => {
    try {
      setIsLoading(true);
      const response = await bookService.getBookById(bookId);
      if (response.success && response.data) {
        setBook(response.data.book);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do livro:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do livro');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!book) return;

    try {
      setIsDownloading(true);
      
      // Verificar se o dispositivo suporta compartilhamento
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        // Usar o serviço de download da API
        const downloadUrl = bookService.getBookPdfUrl(book.id);
        
        // Criar nome do arquivo
        const fileName = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        
        console.log('Iniciando download de:', downloadUrl);
        console.log('Salvando em:', fileUri);
        
        // Download do arquivo usando a API
        const downloadResult = await FileSystem.downloadAsync(downloadUrl, fileUri, {
          headers: {
            'Authorization': `Bearer ${await SecureStore.getItemAsync('auth_token')}`
          }
        });
        
        console.log('Resultado do download:', downloadResult);
        
        // Verificar se o download foi bem-sucedido
        if (downloadResult.status >= 200 && downloadResult.status < 300) {
          console.log('Download concluído com sucesso');
          
          // Verificar se o arquivo foi criado
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (fileInfo.exists && fileInfo.size > 0) {
            console.log('Arquivo criado com sucesso, tamanho:', fileInfo.size);
            
            // Compartilhar arquivo
            await Sharing.shareAsync(fileUri, {
              mimeType: 'application/pdf',
              dialogTitle: `Download de ${book.title}`,
            });
            
            Alert.alert('Sucesso!', 'Livro baixado com sucesso!');
          } else {
            throw new Error('Arquivo não foi criado corretamente');
          }
        } else {
          throw new Error(`Erro no download: Status ${downloadResult.status}`);
        }
      } else {
        // Fallback: abrir no navegador
        const downloadUrl = bookService.getBookPdfUrl(book.id);
        console.log('Abrindo no navegador:', downloadUrl);
        await Linking.openURL(downloadUrl);
      }
    } catch (error) {
      console.error('Erro no download:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      Alert.alert('Erro', `Não foi possível fazer o download do livro: ${errorMessage}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff0000" />
        <Text style={styles.loadingText}>Carregando detalhes do livro...</Text>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Livro não encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com imagem */}
        <View style={styles.imageContainer}>
                                                                                                               <Image
                     source={{ uri: book.image_url }}
                     style={styles.bookCover}
                     resizeMode="contain"
                     onError={(error) => console.log('Erro ao carregar imagem:', error.nativeEvent.error)}
                     key={`${book.id}_${Date.now()}`}
                   />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageOverlay}
          />
          <TouchableOpacity
            style={styles.backButtonHeader}
            onPress={handleBackPress}
          >
            <Text style={styles.backButtonHeaderText}>← Voltar</Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <View style={styles.content}>
          <View style={styles.bookHeader}>
                             <Text style={styles.bookTitle}>{book.title}</Text>
                 <Text style={styles.bookAuthor}>por {book.short_description}</Text>
            <View style={styles.bookMeta}>
              <Text style={styles.bookCategory}>Desenvolvimento Pessoal</Text>
              <Text style={styles.bookDownloads}>
                Disponível para download
              </Text>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Descrição</Text>
                             <Text style={styles.bookDescription}>{book.description}</Text>
          </View>

          <View style={styles.downloadSection}>
            <Text style={styles.sectionTitle}>Download</Text>
            <Text style={styles.downloadInfo}>
              Clique no botão abaixo para baixar este livro em formato PDF.
            </Text>
            
            <TouchableOpacity
              style={[styles.downloadButton, isDownloading && styles.downloadingButton]}
              onPress={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <View style={styles.downloadingContent}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.downloadButtonText}>Baixando...</Text>
                </View>
              ) : (
                <View style={styles.downloadContent}>
                  <Text style={styles.downloadIcon}>⬇️</Text>
                  <Text style={styles.downloadButtonText}>Baixar PDF</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informações</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categoria:</Text>
              <Text style={styles.infoValue}>Desenvolvimento Pessoal</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={styles.statusValue}>Download Disponível</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Adicionado em:</Text>
              <Text style={styles.infoValue}>
                {new Date(book.created_at).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  bookCover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  backButtonHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonHeaderText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  bookHeader: {
    marginBottom: 25,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    lineHeight: 32,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 15,
    fontStyle: 'italic',
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontWeight: '500',
  },
  bookDownloads: {
    fontSize: 12,
    color: '#999',
  },
  descriptionSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  bookDescription: {
    fontSize: 15,
    color: '#000000',
    lineHeight: 24,
  },
  downloadSection: {
    marginBottom: 25,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  downloadInfo: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 20,
    lineHeight: 20,
  },
  downloadButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  downloadingButton: {
    backgroundColor: '#999',
  },
  downloadContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  infoSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
