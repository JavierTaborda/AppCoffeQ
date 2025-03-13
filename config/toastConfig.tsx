
import { BaseToast, ErrorToast } from "react-native-toast-message";
import { colors } from "@/constants/colors";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.primary,
        backgroundColor: colors.lightWhite,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 18, 
        fontWeight: "bold",
        color: colors.darkGray,
      }}
      text2Style={{
        fontSize: 16, 
        color: colors.gray,
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: colors.danger,
        backgroundColor: colors.lightWhite,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 18,
        fontWeight: "bold",
        color: colors.darkGray,
      }}
      text2Style={{
        fontSize: 18,
        color: colors.gray,
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.secondary,
        backgroundColor: colors.lightWhite,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 18,
        fontWeight: "bold",
        color: colors.darkGray,
      }}
      text2Style={{
        fontSize: 16,
        color: colors.gray,
      }}
    />
  ),
};
