import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList } from '../types';
import { CustomModal } from '../components/CustomModal';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();
  
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [numero, setNumero] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const validateForm = () => {
    if (!login.trim() || !email.trim() || !numero.trim() || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return false;
    }

    if (login.trim().length < 3) {
      Alert.alert('Erro', 'O login deve ter pelo menos 3 caracteres');
      return false;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return false;
    }

    if (numero.trim().length < 10) {
      Alert.alert('Erro', 'O número deve ter pelo menos 10 caracteres');
      return false;
    }

    return true;
  };

  const handleRegister = () => {
    if (!validateForm()) return;
    setShowConfirmationModal(true);
  };

  const formatConfirmationMessage = () => {
    return `Confirme os dados da sua conta:

Nome: ${login}
Email: ${email}
Telefone: ${numero}

Deseja criar a conta com essas informações?`;
  };

  const renderConfirmationModal = () => (
    <View style={styles.confirmationModalContainer}>
      <View style={styles.confirmationModalHeader}>
        <Text style={styles.confirmationModalIcon}>📝</Text>
        <Text style={styles.confirmationModalTitle}>Confirmar Cadastro</Text>
        <Text style={styles.confirmationModalSubtitle}>Revise os dados antes de criar sua conta</Text>
      </View>
      
      <View style={styles.confirmationModalBody}>
        <View style={styles.confirmationDataContainer}>
          <View style={styles.confirmationDataRow}>
            <Text style={styles.confirmationDataLabel}>Nome Completo</Text>
            <Text style={styles.confirmationDataValue}>{login}</Text>
          </View>
          
          <View style={styles.confirmationDataRow}>
            <Text style={styles.confirmationDataLabel}>Email</Text>
            <Text style={styles.confirmationDataValue}>{email}</Text>
          </View>
          
          <View style={styles.confirmationDataRow}>
            <Text style={styles.confirmationDataLabel}>Telefone</Text>
            <Text style={styles.confirmationDataValue}>{numero}</Text>
          </View>
        </View>
        
        <Text style={styles.confirmationQuestion}>
          Deseja criar a conta com essas informações?
        </Text>
      </View>
      
      <View style={styles.confirmationModalButtons}>
        <TouchableOpacity
          style={styles.confirmationCancelButton}
          onPress={() => setShowConfirmationModal(false)}
        >
          <Text style={styles.confirmationCancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.confirmationConfirmButton}
          onPress={confirmRegistration}
        >
          <Text style={styles.confirmationConfirmButtonText}>Sim, Criar Conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const confirmRegistration = async () => {
    setShowConfirmationModal(false);
    setIsLoading(true);
    
    try {
      const success = await register({
        login: login.trim(),
        email: email.trim(),
        numero: numero.trim(),
        senha,
        confirmarSenha,
      });

      if (success) {
        setShowSuccessModal(true);
      } else {
        Alert.alert('Erro', 'Não foi possível criar a conta. Tente novamente.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao criar a conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#ff0000', '#cc0000']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Criar Conta</Text>
              <Text style={styles.subtitle}>Preencha os dados para começar</Text>
            </View>

            <View style={styles.form}>
                             <View style={styles.inputContainer}>
                 <Text style={styles.label}>Nome Completo</Text>
                 <TextInput
                   style={styles.input}
                   placeholder="Digite seu nome completo"
                   placeholderTextColor="#999"
                   value={login}
                   onChangeText={setLogin}
                   autoCapitalize="words"
                   autoCorrect={false}
                 />
               </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Número</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu número de telefone"
                  placeholderTextColor="#999"
                  value={numero}
                  onChangeText={setNumero}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#999"
                  value={senha}
                  onChangeText={setSenha}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Senha</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirme sua senha"
                  placeholderTextColor="#999"
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <Text style={styles.registerButtonText}>
                  {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Já tem uma conta?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.linkButton}
              >
                <Text style={styles.linkText}>Fazer login</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Voltar</Text>
            </TouchableOpacity>
                     </View>
         </ScrollView>
       </LinearGradient>
       
       <Modal
         visible={showConfirmationModal}
         transparent
         animationType="fade"
         statusBarTranslucent
       >
         <View style={styles.modalOverlay}>
           {renderConfirmationModal()}
         </View>
       </Modal>
       
       <CustomModal
         visible={showSuccessModal}
         title="Conta Criada!"
         message="Sua conta foi criada com sucesso! Você será redirecionado automaticamente para o app."
         type="success"
         confirmText="Entendi"
         onConfirm={() => setShowSuccessModal(false)}
       />
     </KeyboardAvoidingView>
   );
 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    opacity: 0.9,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff0000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.8,
  },
  linkButton: {
    marginLeft: 5,
  },
  linkText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
     backButtonText: {
     fontSize: 16,
     color: '#000000',
     opacity: 0.8,
   },
   
   // Estilos do modal de confirmação personalizado
   modalOverlay: {
     flex: 1,
     backgroundColor: 'rgba(0, 0, 0, 0.7)',
     justifyContent: 'center',
     alignItems: 'center',
   },
   confirmationModalContainer: {
     width: '85%',
     backgroundColor: '#ffffff',
     borderRadius: 20,
     overflow: 'hidden',
     shadowColor: '#000',
     shadowOffset: {
       width: 0,
       height: 10,
     },
     shadowOpacity: 0.4,
     shadowRadius: 20,
     elevation: 20,
   },
   confirmationModalHeader: {
     backgroundColor: '#ff0000',
     paddingVertical: 25,
     paddingHorizontal: 20,
     alignItems: 'center',
   },
   confirmationModalIcon: {
     fontSize: 48,
     marginBottom: 10,
   },
   confirmationModalTitle: {
     fontSize: 24,
     fontWeight: 'bold',
     color: '#ffffff',
     textAlign: 'center',
     marginBottom: 5,
   },
   confirmationModalSubtitle: {
     fontSize: 14,
     color: '#ffffff',
     textAlign: 'center',
     opacity: 0.9,
   },
   confirmationModalBody: {
     padding: 25,
   },
   confirmationDataContainer: {
     backgroundColor: '#f8f9fa',
     borderRadius: 12,
     padding: 20,
     marginBottom: 20,
   },
   confirmationDataRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     paddingVertical: 12,
     borderBottomWidth: 1,
     borderBottomColor: '#e9ecef',
   },
   confirmationDataLabel: {
     fontSize: 14,
     color: '#6c757d',
     fontWeight: '600',
     flex: 1,
   },
   confirmationDataValue: {
     fontSize: 14,
     color: '#000000',
     fontWeight: '700',
     flex: 2,
     textAlign: 'right',
   },
   confirmationQuestion: {
     fontSize: 16,
     color: '#333333',
     textAlign: 'center',
     fontWeight: '600',
     lineHeight: 22,
   },
   confirmationModalButtons: {
     flexDirection: 'row',
     paddingHorizontal: 25,
     paddingBottom: 25,
     gap: 15,
   },
   confirmationCancelButton: {
     flex: 1,
     paddingVertical: 15,
     paddingHorizontal: 20,
     borderRadius: 25,
     alignItems: 'center',
     backgroundColor: '#f8f9fa',
     borderWidth: 2,
     borderColor: '#e9ecef',
   },
   confirmationCancelButtonText: {
     fontSize: 16,
     fontWeight: '600',
     color: '#6c757d',
   },
   confirmationConfirmButton: {
     flex: 1,
     paddingVertical: 15,
     paddingHorizontal: 20,
     borderRadius: 25,
     alignItems: 'center',
     backgroundColor: '#ff0000',
     shadowColor: '#000',
     shadowOffset: {
       width: 0,
       height: 3,
     },
     shadowOpacity: 0.3,
     shadowRadius: 6,
     elevation: 8,
   },
   confirmationConfirmButtonText: {
     fontSize: 16,
     fontWeight: '600',
     color: '#ffffff',
   },
 });
