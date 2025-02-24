import React, { useRef, useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from "react-native";
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
  const panY = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
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

  useEffect(() => {
    if (isVisible) {
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
      panY.setValue(0);
    }
  }, [isVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isScrolling && isAtTop,
      onMoveShouldSetPanResponder: () => !isScrolling && isAtTop,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 30 && gestureState.vy > 0.5) {
          Animated.timing(panY, {
            toValue: 500,
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.timing(panY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.modalOverlay,
          {
            opacity: overlayOpacity,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
          >
            <View style={styles.dragBarContainer} {...panResponder.panHandlers}>
              <View style={styles.dragBar} />
            </View>

            {title && <Text style={styles.modalTitle}>{title}</Text>}
            <ScrollView
              style={styles.childrenContent}
              contentContainerStyle={styles.childrenContentContainer}
              onScrollBeginDrag={() => setIsScrolling(true)}
              onScrollEndDrag={() => setIsScrolling(false)}
              scrollEventThrottle={16}
              onScroll={(event) => {
                const { y } = event.nativeEvent.contentOffset;
                setIsAtTop(y <= 0);
              }}
            >
              {children}
            </ScrollView>

            <View style={styles.buttonsContainer}>
              {onConfirm && (
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={onConfirm}
                >
                  <Text style={styles.confirmButtonText}>{confirmText}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    maxHeight: "80%",
  },
  keyboardAvoidingView: {
    width: "100%",
  },
  dragBarContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 10,
  },
  dragBar: {
    width: 80,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  childrenContent: {
    width: "100%",
    flexGrow: 1,
  },
  childrenContentContainer: {
    paddingBottom: 20,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
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
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ModalGeneric;
