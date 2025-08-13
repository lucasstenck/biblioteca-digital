import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CustomModalProps {
  visible: boolean;
  title: string;
  message: string;
  type: 'success' | 'confirmation' | 'error';
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const { width } = Dimensions.get('window');

export const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  message,
  type,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}) => {
  const getModalColors = () => {
    switch (type) {
      case 'success':
        return {
          gradient: ['#28a745', '#20c997'],
          icon: '',
          confirmBg: '#28a745',
        };
      case 'confirmation':
        return {
          gradient: ['#ff0000', '#cc0000'],
          icon: '',
          confirmBg: '#ff0000',
        };
      case 'error':
        return {
          gradient: ['#ff0000', '#b30000'],
          icon: '',
          confirmBg: '#ff0000',
        };
      default:
        return {
          gradient: ['#6c757d', '#495057'],
          icon: '',
          confirmBg: '#6c757d',
        };
    }
  };

  const colors = getModalColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={colors.gradient}
            style={styles.modalHeader}
          >
            <Text style={styles.modalIcon}>{colors.icon}</Text>
            <Text style={styles.modalTitle}>{title}</Text>
          </LinearGradient>
          
          <View style={styles.modalBody}>
            <Text style={styles.modalMessage}>{message}</Text>
            
            <View style={styles.buttonContainer}>
              {onCancel && (
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onCancel}
                >
                  <Text style={styles.cancelButtonText}>
                    {cancelText || 'Cancelar'}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.confirmButton,
                  { backgroundColor: colors.confirmBg }
                ]}
                onPress={onConfirm}
              >
                <Text style={styles.confirmButtonText}>
                  {confirmText || 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  modalBody: {
    padding: 25,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  confirmButton: {
    backgroundColor: '#007bff',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
