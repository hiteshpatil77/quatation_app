import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
  TextInput,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import Icon from "react-native-vector-icons/Ionicons";
import { useState, useCallback } from "react";
import { HP, WP } from "../utils/Dimention";
import { apiCalls } from "../api/api";
import * as Yup from "yup";

export default function CreatLead({ navigation, route }) {
  const isDarkMode = useColorScheme() === "dark";
  const [leads, setLeads] = useState(route.params?.leads || []);
  console.log("leads=-=-=-=", leads);

  // Validation schema
  const LeadSchema = Yup.object().shape({
    CustomerName: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    CustomerAddress: Yup.string()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters"),
    CustomerMobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    CustomerCity: Yup.string()
      .required("City is required")
      .min(2, "City must be at least 2 characters"),
    CustomerPinCode: Yup.string()
      .matches(/^[0-9]{6}$/, "PinCode must be exactly 6 digits")
      .required("PinCode is required"),
    CustomerRef: Yup.string().required("Note is required"),
  });

  const [formValues, setFormValues] = useState({
    CustomerName: "",
    CustomerAddress: "",
    CustomerMobile: "",
    CustomerRef: "",
    CustomerCity: "",
    CustomerPinCode: "",
  });

  const handleAddLead = async (values, { resetForm }) => {
    try {
      await apiCalls.CreatLeadApi(
        values.CustomerName,
        values.CustomerAddress,
        values.CustomerCity,
        values.CustomerPinCode,
        values.CustomerMobile,
        values.CustomerRef
      );
      Alert.alert("Success", "Lead added successfully");
      // Optionally update local leads state
      const newLead = {
        id: Date.now().toString(),
        name: values.CustomerName,
        address: values.CustomerAddress,
        phone: values.CustomerMobile,
        note: values.CustomerRef,
        city: values.CustomerCity,
        pincode: values.CustomerPinCode,
      };
      const updatedLeads = [...leads, newLead];
      setLeads(updatedLeads);
      // Reset form values after successful add
      setFormValues({
        CustomerName: "",
        CustomerAddress: "",
        CustomerMobile: "",
        CustomerRef: "",
        CustomerCity: "",
        CustomerPinCode: "",
      });
      resetForm();
      navigation.navigate("Lead", { leads: updatedLeads });
    } catch (error) {
      console.log("Error adding lead:", error);

      if (
        error.message &&
        (error.message.includes("Invalid or expired token") ||
          error.message.toLowerCase().includes("token"))
      ) {
        Alert.alert(
          "Session Expired",
          "Your session has expired. Please log in again.",
          [
            {
              text: "OK",
              onPress: () => navigation.replace("Login"),
            },
          ]
        );
      } else {
        Alert.alert("Error", error.message || "Failed to add lead");
      }
    }
  };

  // Helper to update local formValues state on every change
  const handleFormChange = useCallback((field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  return (
    <ImageBackground
      source={require("../assets/backGround.png")}
      style={{ flex: 1 }}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={"#fff"}
      />
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: HP(2),
          }}
        >
          <TouchableOpacity
            style={{
              padding: HP(1),
              backgroundColor: "#fff",
              borderRadius: HP(2),
              elevation: 5,
            }}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={25} color="#333" />
          </TouchableOpacity>
          <Text
            style={{
              marginHorizontal: HP(2),
              fontSize: 25,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Add Lead
          </Text>
        </View>

        <View style={styles.container}>
          <Formik
            enableReinitialize
            initialValues={formValues}
            validationSchema={LeadSchema}
            onSubmit={handleAddLead}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              setFieldValue,
              errors,
              touched,
              setFieldTouched,
            }) => (
              <>
                <TextInput
                  placeholder="Name"
                  placeholderTextColor={"gray"}
                  value={values.CustomerName}
                  onChangeText={(text) => {
                    const upper = text.toUpperCase();
                    setFieldValue("CustomerName", upper);
                    handleFormChange("CustomerName", upper);
                  }}
                  onBlur={() => {
                    handleBlur("CustomerName");
                    setFieldTouched("CustomerName", true);
                  }}
                  style={[
                    styles.inputText,
                    errors.CustomerName &&
                      touched.CustomerName &&
                      styles.inputError,
                  ]}
                />
                {errors.CustomerName && touched.CustomerName && (
                  <Text style={styles.errorText}>{errors.CustomerName}</Text>
                )}

                <TextInput
                  placeholder="Address"
                  placeholderTextColor={"gray"}
                  value={values.CustomerAddress}
                  onChangeText={(text) => {
                    setFieldValue("CustomerAddress", text);
                    handleFormChange("CustomerAddress", text);
                  }}
                  onBlur={() => {
                    handleBlur("CustomerAddress");
                    setFieldTouched("CustomerAddress", true);
                  }}
                  style={[
                    styles.inputText,
                    errors.CustomerAddress &&
                      touched.CustomerAddress &&
                      styles.inputError,
                  ]}
                />
                {errors.CustomerAddress && touched.CustomerAddress && (
                  <Text style={styles.errorText}>{errors.CustomerAddress}</Text>
                )}

                <TextInput
                  placeholder="Phone Number"
                  placeholderTextColor={"gray"}
                  value={values.CustomerMobile}
                  onChangeText={(text) => {
                    setFieldValue("CustomerMobile", text);
                    handleFormChange("CustomerMobile", text);
                  }}
                  onBlur={() => {
                    handleBlur("CustomerMobile");
                    setFieldTouched("CustomerMobile", true);
                  }}
                  style={[
                    styles.inputText,
                    errors.CustomerMobile &&
                      touched.CustomerMobile &&
                      styles.inputError,
                  ]}
                  keyboardType="number-pad"
                  maxLength={10}
                />
                {errors.CustomerMobile && touched.CustomerMobile && (
                  <Text style={styles.errorText}>{errors.CustomerMobile}</Text>
                )}

                <TextInput
                  placeholder="City"
                  placeholderTextColor={"gray"}
                  value={values.CustomerCity}
                  onChangeText={(text) => {
                    const upper = text.toUpperCase();
                    setFieldValue("CustomerCity", upper);
                    handleFormChange("CustomerCity", upper);
                  }}
                  onBlur={() => {
                    handleBlur("CustomerCity");
                    setFieldTouched("CustomerCity", true);
                  }}
                  style={[
                    styles.inputText,
                    errors.CustomerCity &&
                      touched.CustomerCity &&
                      styles.inputError,
                  ]}
                />
                {errors.CustomerCity && touched.CustomerCity && (
                  <Text style={styles.errorText}>{errors.CustomerCity}</Text>
                )}

                <TextInput
                  placeholder="PinCode"
                  placeholderTextColor={"gray"}
                  value={values.CustomerPinCode}
                  onChangeText={(text) => {
                    setFieldValue("CustomerPinCode", text);
                    handleFormChange("CustomerPinCode", text);
                  }}
                  onBlur={() => {
                    handleBlur("CustomerPinCode");
                    setFieldTouched("CustomerPinCode", true);
                  }}
                  style={[
                    styles.inputText,
                    errors.CustomerPinCode &&
                      touched.CustomerPinCode &&
                      styles.inputError,
                  ]}
                  keyboardType="number-pad"
                  maxLength={6}
                />
                {errors.CustomerPinCode && touched.CustomerPinCode && (
                  <Text style={styles.errorText}>{errors.CustomerPinCode}</Text>
                )}

                <TextInput
                  placeholder="Note"
                  placeholderTextColor={"gray"}
                  value={values.CustomerRef}
                  onChangeText={(text) => {
                    setFieldValue("CustomerRef", text);
                    handleFormChange("CustomerRef", text);
                  }}
                  onBlur={() => {
                    handleBlur("CustomerRef");
                    setFieldTouched("CustomerRef", true);
                  }}
                  style={[
                    styles.inputText,
                    errors.CustomerRef &&
                      touched.CustomerRef &&
                      styles.inputError,
                  ]}
                  multiline
                />
                {errors.CustomerRef && touched.CustomerRef && (
                  <Text style={styles.errorText}>{errors.CustomerRef}</Text>
                )}

                <TouchableOpacity
                  style={{
                    backgroundColor: "#333",
                    padding: 15,
                    borderRadius: 10,
                    marginTop: 20,
                    alignItems: "center",
                  }}
                  onPress={handleSubmit}
                >
                  <Text style={{ color: "#fff", fontSize: 18 }}>Add Lead</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  inputText: {
    height: HP(6),
    width: WP(85),
    borderRadius: HP(2),
    marginVertical: 10,
    fontSize: 16,
    color: "black",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    shadowColor: "#000",
    elevation: 5,
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: WP(7.5),
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
});
