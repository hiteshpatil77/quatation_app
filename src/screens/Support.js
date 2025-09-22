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
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useState, useCallback } from "react";
import { HP, WP } from "../utils/Dimention";
import { apiCalls } from "../api/api";
import { Dropdown } from "react-native-element-dropdown";

// Validation schema
const validationSchema = Yup.object().shape({
  ConsumerNumber: Yup.string().required("Consumer number is required"),
  CustomerName: Yup.string().required("Name is required"),
  CustomerAddress: Yup.string().required("Address is required"),
  CustomerMobile: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  CustomerRef: Yup.string().optional(),
  CustomerCity: Yup.string().required("City is required"),
  CustomerDescription: Yup.string().required("Description is required"),
  priority: Yup.string().required("Priority is required"),
  category: Yup.string().required("Category is required"),
});

export default function Support({ navigation, route }) {
  const isDarkMode = useColorScheme() === "dark";
  const [leads, setLeads] = useState(route.params?.leads || []);
  const [isFocus, setIsFocus] = useState(false);
  console.log("leads=-=-=-=", leads);

  // Add local state to persist form values
  const [formValues, setFormValues] = useState({
    ConsumerNumber: "",
    CustomerName: "",
    CustomerAddress: "",
    CustomerMobile: "",
    CustomerRef: "",
    CustomerCity: "",
    CustomerDescription: "",
    priority: "",
    category: "",
  });

  const handleAddLead = async (values, { resetForm }) => {
    try {
      let data = JSON.stringify({
        consumerNumber: values.ConsumerNumber,
        name: values.CustomerName,
        address: values.CustomerAddress,
        city: values.CustomerCity,
        phone: values.CustomerMobile,
        description: values.CustomerDescription,
        note: values.CustomerRef,
        priority: values.priority,
        category: values.category,
      });

      console.log("Payload Data >>>", data);

      await apiCalls.AddComplaint(
        values.CustomerName,
        values.CustomerAddress,
        values.CustomerCity,
        values.CustomerDescription,
        values.CustomerMobile,
        values.CustomerRef,
        values.ConsumerNumber,
        values.priority,
        values.category
      );

      Alert.alert("Success", "Complaint added successfully");

      // Reset form including new fields
      setFormValues({
        ConsumerNumber: "",
        CustomerName: "",
        CustomerAddress: "",
        CustomerMobile: "",
        CustomerRef: "",
        CustomerCity: "",
        CustomerDescription: "",
        priority: "",
        category: "",
      });

      resetForm();

      navigation.navigate("Complaint", {
        leads: [...leads, JSON.parse(data)],
      });
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
          [{ text: "OK", onPress: () => navigation.replace("Login") }]
        );
      } else {
        Alert.alert("Error", error.message || "Failed to add complaint");
      }
    }
  };

  const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
  ];

  const categoryOption = [
    { label: "Technical", value: "technical" },
    { label: "Billing", value: "billing" },
    { label: "Service", value: "service" },
    { label: "Installation", value: "installation" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Other", value: "other" },
  ];

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
      <ImageBackground source={require("../assets/backGround.png")}>
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: HP(2),
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{
                  padding: HP(1),
                  backgroundColor: "#fff",
                  borderRadius: HP(2),
                  elevation: 5,
                  alignSelf: "flex-start",
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
                Support
              </Text>
            </View>
            <MaterialIcons name="support-agent" color={"#333"} size={35} />
          </View>

          <View style={styles.container}>
            <Formik
              enableReinitialize
              initialValues={formValues}
              validationSchema={validationSchema}
              onSubmit={handleAddLead}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
                setFieldTouched,
              }) => (
                <>
                  <TextInput
                    placeholder="Enter Consumer Number"
                    placeholderTextColor={"gray"}
                    value={values.ConsumerNumber}
                    onChangeText={(text) => {
                      setFieldValue("ConsumerNumber", text);
                      handleFormChange("ConsumerNumber", text);
                    }}
                    style={[
                      styles.inputText,
                      errors.ConsumerNumber &&
                        touched.ConsumerNumber &&
                        styles.inputError,
                    ]}
                    onBlur={() => {
                      handleBlur("ConsumerNumber");
                      setFieldTouched("ConsumerNumber", true);
                    }}
                    keyboardType="number-pad"
                  />
                  {errors.ConsumerNumber && touched.ConsumerNumber && (
                    <Text style={styles.errorText}>
                      {errors.ConsumerNumber}
                    </Text>
                  )}

                  <TextInput
                    placeholder="Name"
                    placeholderTextColor={"gray"}
                    value={values.CustomerName}
                    onChangeText={(text) => {
                      setFieldValue("CustomerName", text);
                      handleFormChange("CustomerName", text);
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
                    <Text style={styles.errorText}>
                      {errors.CustomerAddress}
                    </Text>
                  )}

                  <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor={"gray"}
                    value={values.CustomerMobile}
                    maxLength={10}
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
                  />
                  {errors.CustomerMobile && touched.CustomerMobile && (
                    <Text style={styles.errorText}>
                      {errors.CustomerMobile}
                    </Text>
                  )}

                  <TextInput
                    placeholder="City"
                    placeholderTextColor={"gray"}
                    value={values.CustomerCity}
                    onChangeText={(text) => {
                      setFieldValue("CustomerCity", text);
                      handleFormChange("CustomerCity", text);
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
                    placeholder="Description"
                    placeholderTextColor={"gray"}
                    value={values.CustomerDescription}
                    onChangeText={(text) => {
                      setFieldValue("CustomerDescription", text);
                      handleFormChange("CustomerDescription", text);
                    }}
                    onBlur={() => {
                      handleBlur("CustomerDescription");
                      setFieldTouched("CustomerDescription", true);
                    }}
                    style={[
                      styles.inputText,
                      errors.CustomerDescription &&
                        touched.CustomerDescription &&
                        styles.inputError,
                    ]}
                    multiline
                  />
                  {errors.CustomerDescription &&
                    touched.CustomerDescription && (
                      <Text style={styles.errorText}>
                        {errors.CustomerDescription}
                      </Text>
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
                    style={styles.inputText}
                    multiline
                  />

                  <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <View style={{ width: WP(41), marginRight: WP(2) }}>
                      <Dropdown
                        style={[
                          styles.inputText,
                          isFocus && { borderColor: "blue" },
                          errors.category &&
                            touched.category &&
                            styles.inputError,
                          { width: WP(41) },
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        itemTextStyle={{ color: "black" }}
                        data={categoryOption}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select category"
                        value={values.category}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => {
                          setIsFocus(false);
                          setFieldTouched("category", true);
                        }}
                        onChange={(item) => {
                          setFieldValue("category", item.value);
                        }}
                      />
                      {errors.category && touched.category && (
                        <Text style={styles.errorText}>{errors.category}</Text>
                      )}
                    </View>

                    <View style={{ width: WP(41), marginLeft: WP(2) }}>
                      <Dropdown
                        style={[
                          styles.inputText,
                          isFocus && { borderColor: "blue" },
                          errors.priority &&
                            touched.priority &&
                            styles.inputError,
                          { width: WP(41) },
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        itemTextStyle={{ color: "black" }}
                        data={priorityOptions}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select priority"
                        value={values.priority}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => {
                          setIsFocus(false);
                          setFieldTouched("priority", true);
                        }}
                        onChange={(item) => {
                          setFieldValue("priority", item.value);
                        }}
                      />
                      {errors.priority && touched.priority && (
                        <Text style={styles.errorText}>{errors.priority}</Text>
                      )}
                    </View>
                  </View>

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
                    <Text style={{ color: "#fff", fontSize: 18 }}>
                      Add Complaint
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
      </ImageBackground>
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
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: WP(7.5),
  },
  placeholderStyle: {
    fontSize: 16,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "black",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
