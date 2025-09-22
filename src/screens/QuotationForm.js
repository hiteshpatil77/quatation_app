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
  Animated,
} from "react-native";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { pdfpdf } from "../assets/pdfpdf";
import { Formik } from "formik";
import CsButton from "../components/CustomeButton";
import { Dropdown } from "react-native-element-dropdown";
import { useEffect, useRef, useState } from "react";
import FileViewer from "react-native-file-viewer";
import { FS, HP, WP } from "../utils/Dimention";
import Icon from "react-native-vector-icons/Ionicons";
import { apiCalls } from "../api/api";
import axios from "axios";
import FormData from "form-data";
import Colors from "../utils/Colors";

export default function Pddf({ navigation, route }) {
  const { lead } = route.params || {};
  console.log("lead=-=-=-=", lead);

  const isDarkMode = useColorScheme() === "dark";
  const [isFocus, setIsFocus] = useState(false);

  const backgroundStyle = {
    // backgroundColor: Colors.lighter,
  };

  const createPDF = async (data) => {
    console.log("Creating PDF with data:", data);

    try {
      // Log all form data before PDF generation
      console.log("Form Data for PDF and Upload:", data);

      const htmlString = pdfpdf(data);
      const today = new Date();
      let PDFOptions = {
        html: `${htmlString}`,
        fileName: `${data.CustomerName.split(" ")[0]}_${today.getDate()}_${
          today.getMonth() + 1
        }-${today.getHours()}_${today.getMinutes()}`,
        directory: Platform.OS === "android" ? "Downloadss" : "Documents",
        base64: true,
      };
      let file = await RNHTMLtoPDF.convert(PDFOptions);

      if (!file.filePath) return;

      // Log PDF file path and create a file URL
      const fileUrl =
        Platform.OS === "android" ? "file://" + file.filePath : file.filePath;
      console.log("Generated PDF file path:", file.filePath);
      console.log("Generated PDF file URL:", fileUrl);

      // Upload PDF and form data, and pass the fileUrl for logging/sending
      await uploadPDFWithForm(data, file.filePath, fileUrl);

      Alert.alert("stored successfully", "PDF File", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open",
          onPress: () => {
            openFile(file.filePath);
          },
        },
      ]);

      const openFile = (path) => {
        FileViewer.open(path, {
          displayName: "string",
          showAppsSuggestions: true,
          showOpenWithDialog: true,
        })
          .then(() => {
            // success
          })
          .catch((error) => {
            Alert.alert("Error While Opening File:", error.message);
          });
      };
    } catch (error) {
      Alert.alert("Failed to generate pdf:", error.message);
    }
  };

  // Upload PDF and form data to API
  const uploadPDFWithForm = async (values, pdfPath, fileUrl) => {
    try {
      console.log("Uploading with values:", values);
      console.log("Uploading PDF path:", pdfPath);

      // Prepare multipart form-data
      const formData = new FormData();

      // Add file
      formData.append("pdf", {
        uri: pdfPath.startsWith("file://") ? pdfPath : `file://${pdfPath}`,
        type: "application/pdf",
        name: "quotation.pdf",
      });

      // Add other fields
      if (lead?._id) {
        formData.append("_id", lead._id);
      } else {
        console.log("Lead ID is missing!");
      }

      formData.append("consumerNumber", values.ConsumerNumber);
      formData.append("name", values.CustomerName);
      formData.append("email", values.CustomerEmail);
      formData.append("address", values.CustomerAddress);
      formData.append("city", values.CustomerCity);
      formData.append("pincode", values.CustomerPincode);
      formData.append("phone", values.CustomerMobile);
      formData.append(
        "customerType",
        (values.customerType || "").toLowerCase()
      );
      formData.append("status", "orderPending");
      formData.append("panelBrand", values.panelBrandName);
      formData.append("panelCapacity", values.panelWattPeak);
      formData.append("panelBrandCharge", values.panelBrandCharges);
      formData.append("numberOfPanel", values.NoOfPanel);
      formData.append("ratePerPanel", values.sellingRate);
      formData.append("inverterBrand", values.inverterBrand);
      formData.append("inverterCapacity", values.inverterCapacity);
      formData.append("inverterCharge", values.inverterCharges);
      formData.append("currentPhase", values.noOfPhase);
      formData.append("meterCharge", values.meterCharges);
      formData.append("structureCharge", values.structureCharges);
      formData.append("gst", values.gstPercent);
      formData.append("note", "");

      // Get token from storage if needed
      // import AsyncStorage if not already
      const token = await (
        await import("@react-native-async-storage/async-storage")
      ).default.getItem("accessToken");
      console.log("Token for upload:", token);

      await apiCalls.CreateQuotation(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch (error) {
      if (error.response) {
        console.log("Upload Error Response:", error.response.data);
      } else if (error.request) {
        console.log("Upload Error Request:", error.request);
      } else {
        console.log("Upload Error Message:", error.message);
      }
      Alert.alert("Failed to upload PDF", error?.message || "Unknown error");
    }
  };

  const panelBrandDetail = [
    { label: "ADANI", value: 1 },
    { label: "WAARE", value: 2 },
    { label: "GOLDI", value: 3 },
    { label: "PAHAL", value: 4 },
    { label: "REYZON", value: 5 },
    { label: "TATA", value: 6 },
  ];
  const inverterBrandDetail = [
    { label: "K SOLAR" },
    { label: "DEYE" },
    { label: "V SOLE" },
    { label: "MINDRA" },
    { label: "X WATT" },
    { label: "OTHER" },
  ];
  const getPanelCapacityRange = () => {
    const from = 540;
    const to = 650;
    const array = [];
    for (let i = from; i <= to; i += 5) {
      array.push({ label: `${i}` });
    }
    return array;
  };
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const position = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFocused || value) {
      Animated.timing(position, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(position, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [isFocused, value]);

  const handleFocus = () => setIsFocused(true);

  const labelStyle = {
    position: "absolute",
    left: HP(5),
    top: position.interpolate({
      inputRange: [0, 1.2],
      outputRange: [18, -8],
    }),
    fontSize: position.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 13],
    }),
    color: isFocused ? Colors.primary : "gray",
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ImageBackground source={require("../assets/backGround.png")}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={backgroundStyle}
        >
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
              Create Quotation Form
            </Text>
          </View>
          <View
            style={[
              {
                // backgroundColor: Colors.white,
              },
              styles.container,
            ]}
          >
            <Formik
              initialValues={{
                ConsumerNumber: "",
                CustomerName: lead?.name || "",
                CustomerAddress: lead?.address || "",
                CustomerEmail: lead?.email || "",
                CustomerMobile: lead?.phone || "",
                CustomerCity: lead?.city || "",
                CustomerPincode: lead?.pincode || "",
                customerType: "household", // changed default to match API
                panelBrandName: `${panelBrandDetail[0].label}`,
                panelBrandCharges: "1000",
                NoOfPanel: "1",
                sellingRate: "42000",
                panelWattPeak: "575",
                inverterBrand: `${inverterBrandDetail[0].label}`,
                inverterCapacity: "3.2",
                inverterCharges: "0",
                structureCharges: "4000",
                meterCharges: "3350",
                gstPercent: "13.8",
                noOfMeter: "1",
                noOfPhase: "1",
              }}
              onSubmit={async (values) => {
                try {
                  await createPDF(values);
                } catch (error) {
                  Alert.alert(
                    "Failed to create quotation",
                    error?.message || "Unknown error"
                  );
                }
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                setFieldValue,
              }) => (
                <>
                  {/* <Text style={styles.inputLable}>Consumer Number</Text> */}
                  {/* <View style={styles.inputText}> */}

                  <Animated.Text style={labelStyle}>
                    Consumer Number
                  </Animated.Text>
                  <TextInput
                    placeholder="Enter Consumer Number"
                    placeholderTextColor={"gray"}
                    value={values.ConsumerNumber}
                    onChangeText={handleChange("ConsumerNumber")}
                    onBlur={handleBlur("ConsumerNumber")}
                    style={styles.inputText}
                    onFocus={handleFocus}
                    // onBlur={handleBlur}
                  />
                  {/* </View> */}
                  {/* <Text style={styles.inputLable}>Name</Text> */}
                  {isFocused && (
                    <Animated.Text style={[labelStyle, { top: HP(9) }]}>
                      Customer Name
                    </Animated.Text>
                  )}
                  <TextInput
                    placeholder="Name"
                    placeholderTextColor={"gray"}
                    value={values.CustomerName?.toUpperCase()}
                    onChangeText={(text) =>
                      handleChange("CustomerName")(text.toUpperCase(text))
                    }
                    onBlur={handleBlur("CustomerName")}
                    style={[styles.inputText, { textTransform: "uppercase" }]}
                    onFocus={handleFocus}
                  />
                  {/* <Text style={styles.inputLable}>Address</Text> */}
                  {isFocused && (
                    <Animated.Text style={[labelStyle, { top: HP(18.4) }]}>
                      Customer Address
                    </Animated.Text>
                  )}
                  <TextInput
                    placeholder="Address"
                    placeholderTextColor={"gray"}
                    value={values.CustomerAddress}
                    onChangeText={handleChange("CustomerAddress")}
                    onBlur={handleBlur("CustomerAddress")}
                    style={styles.inputText}
                    onFocus={handleFocus}
                  />
                  {isFocused && (
                    <Animated.Text style={[labelStyle, { top: HP(27.7) }]}>
                      Customer City
                    </Animated.Text>
                  )}
                  <TextInput
                    placeholder="City"
                    placeholderTextColor={"gray"}
                    value={values.CustomerCity?.toUpperCase()}
                    onChangeText={(text) =>
                      handleChange("CustomerCity")(text.toUpperCase())
                    }
                    onBlur={handleBlur("CustomerCity")}
                    onFocus={handleFocus}
                    style={[styles.inputText, { textTransform: "uppercase" }]} // enforces UI caps
                  />
                  {isFocused && (
                    <Animated.Text style={[labelStyle, { top: HP(37) }]}>
                      Customer Pincode
                    </Animated.Text>
                  )}
                  <TextInput
                    placeholder="Pincode"
                    placeholderTextColor={"gray"}
                    value={values.CustomerPincode}
                    onChangeText={handleChange("CustomerPincode")}
                    onBlur={handleBlur("CustomerPincode")}
                    style={styles.inputText}
                    onFocus={handleFocus}
                  />
                  {/* <Text style={styles.inputLable}>Email</Text> */}
                  {isFocused && (
                    <Animated.Text style={[labelStyle, { top: HP(46.5) }]}>
                      Customer Email
                    </Animated.Text>
                  )}
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor={"gray"}
                    value={values.CustomerEmail}
                    onChangeText={handleChange("CustomerEmail")}
                    onBlur={handleBlur("CustomerEmail")}
                    style={styles.inputText}
                    onFocus={handleFocus}
                  />

                  {/* <Text style={styles.inputLable}>Phone Number</Text> */}
                  {isFocused && (
                    <Animated.Text style={[labelStyle, { top: HP(56) }]}>
                      Phone Number
                    </Animated.Text>
                  )}
                  <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor={"gray"}
                    value={values.CustomerMobile}
                    onChangeText={handleChange("CustomerMobile")}
                    onBlur={handleBlur("CustomerMobile")}
                    style={styles.inputText}
                    keyboardType="number-pad"
                    onFocus={handleFocus}
                  />

                  {/* <Text
                    style={{
                      alignSelf: "flex-start",
                      left: WP(10),
                      marginTop: HP(1.5),
                      fontSize: FS(2),
                      color: "#000",
                    }}
                  >
                    Customer Type
                  </Text> */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 10,
                      paddingHorizontal: WP(5),
                    }}
                  >
                    <Dropdown
                      style={[
                        styles.inputText,
                        isFocus && { borderColor: "blue" },
                        { width: WP(41), marginRight: WP(3) },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={{ color: "black" }}
                      data={[
                        { label: "Household", value: "household" },
                        { label: "Organization", value: "org" },
                        { label: "Commercial", value: "commercial" },
                      ]}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      placeholder={
                        values.customerType
                          ? [
                              { label: "Household", value: "household" },
                              { label: "Organization", value: "org" },
                              { label: "Commercial", value: "commercial" },
                            ].find((item) => item.value === values.customerType)
                              ?.label || "Select item"
                          : "Select item"
                      }
                      onChange={(item) => {
                        setFieldValue("customerType", item.value);
                      }}
                    />
                    <View style={{ bottom: HP(0) }}>
                      <Dropdown
                        style={[
                          styles.inputText,
                          isFocus && { borderColor: "blue" },
                          { width: WP(41) },
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        itemTextStyle={{ color: "black" }}
                        data={panelBrandDetail}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="label"
                        placeholder={
                          values.panelBrandName
                            ? values.panelBrandName
                            : "Select item"
                        }
                        searchPlaceholder="Search..."
                        onChange={(item) => {
                          setFieldValue("panelBrandName", item.label);
                        }}
                      />
                    </View>
                  </View>
                  {/* <Text style={styles.inputLable}>Panel Brand Charge</Text> */}
                  {isFocused && (
                    <Animated.Text style={[labelStyle, { top: HP(77) }]}>
                      Panel Brand Charge
                    </Animated.Text>
                  )}
                  <TextInput
                    name="panelBrandCharges"
                    placeholder="Panel Brand Charge"
                    placeholderTextColor={"gray"}
                    value={values.panelBrandCharges}
                    onChangeText={handleChange("panelBrandCharges")}
                    onBlur={handleBlur("panelBrandCharges")}
                    style={styles.inputText}
                    keyboardType="number-pad"
                    onFocus={handleFocus}
                  />

                  {/* <Text style={styles.inputLable}>Number Of Panel</Text> */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 10,
                      paddingHorizontal: WP(5),
                    }}
                  >
                    <Dropdown
                      style={[
                        styles.inputText,
                        isFocus && { borderColor: "blue" },
                        { width: WP(41), marginRight: WP(3) },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={{ color: "black" }}
                      data={Array.from({ length: 100 }, (_, i) => {
                        return { label: `${i + 1}` };
                      })}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="label"
                      placeholder={
                        values.NoOfPanel ? values.NoOfPanel : "Select item"
                      }
                      searchPlaceholder="Search..."
                      onChange={(item) => {
                        setFieldValue("NoOfPanel", item.label);
                      }}
                    />

                    {/* <Text style={styles.inputLable}>Panel Capacity</Text> */}

                    <Dropdown
                      style={[
                        styles.inputText,
                        isFocus && { borderColor: "blue" },
                        { width: WP(41) },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={{ color: "black" }}
                      data={getPanelCapacityRange()}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="label"
                      placeholder={
                        values.panelWattPeak
                          ? values.panelWattPeak
                          : "Select item"
                      }
                      searchPlaceholder="Search..."
                      onChange={(item) => {
                        setFieldValue("panelWattPeak", item.label);
                      }}
                    />
                  </View>
                  {/* <Text style={styles.inputLable}>Rate per Panel</Text> */}
                  {isFocused && (
                    <Animated.Text style={[labelStyle, { top: HP(98) }]}>
                      Rate per Panel
                    </Animated.Text>
                  )}
                  <TextInput
                    name="sellingRate"
                    placeholder="Rate per Panel"
                    placeholderTextColor={"gray"}
                    value={values.sellingRate}
                    onChangeText={handleChange("sellingRate")}
                    onBlur={handleBlur("sellingRate")}
                    style={styles.inputText}
                    keyboardType="number-pad"
                    onFocus={handleFocus}
                  />

                  {/* <Text style={styles.inputLable}>Inverter Brand</Text> */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 10,
                      paddingHorizontal: WP(5),
                    }}
                  >
                    <Dropdown
                      style={[
                        styles.inputText,
                        isFocus && { borderColor: "blue" },
                        { width: WP(41), marginRight: WP(3) },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={{ color: "black" }}
                      data={inverterBrandDetail}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="label"
                      placeholder={
                        values.inverterBrand
                          ? values.inverterBrand
                          : "Select item"
                      }
                      searchPlaceholder="Search..."
                      onChange={(item) => {
                        setFieldValue("inverterBrand", item.label);
                      }}
                    />

                    {/* <Text style={styles.inputLable}>Inverter Capacity</Text> */}

                    <Dropdown
                      style={[
                        styles.inputText,
                        isFocus && { borderColor: "blue" },
                        { width: WP(41), marginRight: WP(3) },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      inputSearchStyle={styles.inputSearchStyle}
                      itemTextStyle={{ color: "black" }}
                      data={[
                        { label: "3.2" },
                        { label: "4.0" },
                        { label: "4.2" },
                        { label: "4.6" },
                        { label: "5.0" },
                        { label: "5.4" },
                        { label: "6.0" },
                        { label: "7.0" },
                        { label: "8.0" },
                        { label: "10.0" },
                      ]}
                      search
                      maxHeight={300}
                      labelField="label"
                      valueField="label"
                      placeholder={
                        values.inverterCapacity
                          ? values.inverterCapacity
                          : "Select item"
                      }
                      searchPlaceholder="Search..."
                      onChange={(item) => {
                        setFieldValue("inverterCapacity", item.label);
                      }}
                    />
                  </View>
                  {/* <Text style={styles.inputLable}>Inverter Charges</Text> */}
                  {isFocused && (
                    <Animated.Text style={[labelStyle, { top: HP(119.5) }]}>
                      Inverter Charges
                    </Animated.Text>
                  )}
                  <TextInput
                    name="inverterCharges"
                    placeholder="Inverter Charges"
                    placeholderTextColor={"gray"}
                    value={values.inverterCharges}
                    onChangeText={handleChange("inverterCharges")}
                    onBlur={handleBlur("inverterCharges")}
                    style={styles.inputText}
                    keyboardType="number-pad"
                    onFocus={handleFocus}
                  />
                  {/* <Text style={styles.inputLable}>Current Phase</Text> */}

                  <Dropdown
                    style={[
                      styles.inputText,
                      isFocus && { borderColor: "blue" },
                    ]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    itemTextStyle={{ color: "black" }}
                    data={[{ label: "1" }, { label: "3" }]}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="label"
                    placeholder={
                      values.noOfPhase ? values.noOfPhase : "Select item"
                    }
                    searchPlaceholder="Search..."
                    onChange={(item) => {
                      setFieldValue("noOfPhase", item.label);
                    }}
                  />
                  {/* <Text style={styles.inputLable}>Meter Charge</Text> */}
                  {isFocused && (
                    <Animated.Text style={[labelStyle, { top: HP(138) }]}>
                      Meter Charge
                    </Animated.Text>
                  )}
                  <TextInput
                    name="meterCharges"
                    placeholder="Meter Charge"
                    placeholderTextColor={"gray"}
                    value={values.meterCharges}
                    onChangeText={handleChange("meterCharges")}
                    onBlur={handleBlur("meterCharges")}
                    style={styles.inputText}
                    keyboardType="number-pad"
                    onFocus={handleFocus}
                  />

                  {/* <Text style={styles.inputLable}>Structure Charges</Text> */}
                  {isFocused && (
                    <Animated.Text style={[labelStyle, { top: HP(147.5) }]}>
                      Structure Charges
                    </Animated.Text>
                  )}
                  <TextInput
                    name="structureCharges"
                    placeholder="Structure Charges"
                    placeholderTextColor={"gray"}
                    value={values.structureCharges}
                    onChangeText={handleChange("structureCharges")}
                    onBlur={handleBlur("structureCharges")}
                    style={styles.inputText}
                    onFocus={handleFocus}
                    keyboardType="number-pad"
                  />

                  {/* <Text style={styles.inputLable}>GST %</Text> */}
                  {isFocused && (
                    <Animated.Text style={[labelStyle, { top: HP(157) }]}>
                      GST %
                    </Animated.Text>
                  )}
                  <TextInput
                    name="gstPercent"
                    placeholder="GST %"
                    placeholderTextColor={"gray"}
                    value={values.gstPercent}
                    onChangeText={handleChange("gstPercent")}
                    onBlur={handleBlur("gstPercent")}
                    style={styles.inputText}
                    keyboardType="number-pad"
                    onFocus={handleFocus}
                  />

                  <View style={{ marginBottom: HP(2), marginTop: HP(2) }}>
                    <CsButton
                      name={"Create PDF"}
                      color={Colors.primary}
                      onClick={handleSubmit}
                      width={WP(85)}
                      height={HP(6)}
                    />
                  </View>
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    // height: "100%",
    justifyContent: "center",
  },

  button: {
    padding: 16,
    backgroundColor: "#E9EBED",
    borderColor: "#f4f5f6",
    borderWidth: 1,
  },
  inputLable: {
    color: "#000",
    fontSize: 16,
  },
  inputText: {
    height: HP(6),
    // borderWidth: StyleSheet.hairlineWidth,
    width: WP(85),
    borderRadius: HP(2),
    // borderColor: "black",
    marginVertical: HP(1.7),
    fontSize: 16,
    color: "black",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    shadowColor: "#000",
    elevation: 5,
    justifyContent: "center",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "black",
    paddingHorizontal: 4,
  },
  selectedTextStyle: {
    color: "black",
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "black",
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    fontSize: 16,
    paddingLeft: 10,
  },
});
