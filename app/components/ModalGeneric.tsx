import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import { colors } from "@/constants/colors";

interface ModalGenericProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
}

const ModalGeneric: React.FC<ModalGenericProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  children,
}) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleBackButtonPress = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
    } else {
      onClose();
    }
  };

  return (
  <Modal
  isVisible={isVisible}
  onBackdropPress={handleBackButtonPress}
  onSwipeComplete={handleBackButtonPress}
  swipeDirection={["down"]}
  useNativeDriver
  useNativeDriverForBackdrop
  style={styles.modal}
  backdropOpacity={0.5}
  backdropTransitionInTiming={200}
  backdropTransitionOutTiming={200}
  propagateSwipe={true}
  animationIn="slideInUp"
  animationOut="slideOutDown"
  hideModalContentWhileAnimating={true}
>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContent}
        >
          <View style={styles.swipeIndicator} />

          {title && <Text style={styles.modalTitle}>{title}</Text>}

          {children}

          {onConfirm && (
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>{cancelText}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
    width: "100%",
    height: "100%",
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    maxHeight: "80%",
  },
  swipeIndicator: {
    width: 80,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ModalGeneric;
