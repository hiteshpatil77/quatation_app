import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import PdF from "react-native-vector-icons/FontAwesome6";
import { FS, HP, WP } from "../utils/Dimention";
import { apiCalls } from "../api/api";
import Colors from "../utils/Colors";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import CusSearch from "../components/CusSearch";

export default function ViewQuotation({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState([]); // for status buttons
  const [selectedStatus, setSelectedStatus] = useState(""); // for status dropdown
  const [data, setData] = useState([]);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusChangeItem, setStatusChangeItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [noteById, setNoteById] = useState({});
  const [editingById, setEditingById] = useState({});

  // Unique cities derived from data
  const cityOptions = Array.from(
    new Set(
      (Array.isArray(data) ? data : []).map((it) => it?.city).filter(Boolean)
    )
  );

  // Unique customer types derived from data
  const customerTypeOptions = Array.from(
    new Set(
      (Array.isArray(data) ? data : [])
        .map((it) => it?.customerType)
        .filter(Boolean)
    )
  );

  useEffect(() => {
    if (cityOptions.length) {
      console.log("Available cities:", cityOptions);
    } else {
      console.log("Available cities: [none]");
    }
  }, [cityOptions]);

  useEffect(() => {
    if (customerTypeOptions.length) {
      console.log("Available customer types:", customerTypeOptions);
    } else {
      console.log("Available customer types: [none]");
    }
  }, [customerTypeOptions]);

  // Keep editable notes synced when data changes
  useEffect(() => {
    const map = {};
    (Array.isArray(data) ? data : []).forEach((it) => {
      map[it._id] = typeof it?.note === "string" ? it.note : "";
    });
    setNoteById((prev) => ({ ...map, ...prev }));
  }, [data]);

  const submitNote = async (id) => {
    try {
      await apiCalls.updateQuotation(id, { note: noteById[id] ?? "" });
      setEditingById((prev) => ({ ...prev, [id]: false }));
      // Optionally refresh if server mutates other fields
      fetchQuotations();
    } catch (e) {
      console.error(e);
    }
  };

  // useEffect(() => {
  //   fetchQuotation();
  // }, [page, limit, sortBy, sortOrder]);

  // const fetchQuotation = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await apiCalls.get(
  //       `/quotation/list?sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&limit=${limit}`
  //     );
  //     console.log("responcestatus-=-=-", res);

  //     // 👇 adjust based on API response
  //     setData(res.data?.data || res.data);
  //   } catch (error) {
  //     console.error("API Error:", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await apiCalls.getQuotations();
      if (response && response.quotations) {
        setData(response.quotations);
      } else if (response?.data) {
        setData(response.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching quotations:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);
  //  useFocusEffect(
  //     useCallback(() => {
  //       fetchQuotations();
  //     }, [])
  //   );
  // Filter states
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedKilowatt, setSelectedKilowatt] = useState("");
  const [selectedCustomerType, setSelectedCustomerType] = useState("");

  // Status mapping
  const statusMap = {
    orderPending: { label: "Order Pending", color: "#FFA500" },
    documentCollected: { label: "Document Collected", color: "#17a2b8" },
    documentQuery: { label: "Document Query", color: "#FFA500" },
    registrationDone: { label: "Registration Done", color: "#28a745" },
    loanProcess: { label: "Loan Process", color: "#17a2b8" },
    materialDelivered: {
      label: "Material Delivered Pending",
      color: "#17a2b8",
    },
    materialDelivered: { label: "Material Delivered", color: "#17a2b8" },
    installationDone: { label: "Installation Done", color: "#28a745" },
    filesSubmitted: { label: "Files Submitted", color: "#17a2b8" },
    meterInstalled: { label: "Meter Installed", color: "#28a745" },
    subsidyClaimDone: { label: "Subsidy Claim Done", color: "#17a2b8" },
    subsidyQuery: { label: "Subsidy Query", color: "#FFA500" },
    subsidyReceived: { label: "Subsidy Received", color: "#28a745" },
    paymentPending: { label: "Payment Pending", color: "#FFA500" },
    orderClosed: { label: "Order Closed", color: "#28a745" },
    orderLoss: { label: "Order Loss", color: "#dc3545" },
  };

  const statusData = Object.entries(statusMap).map(([value, { label }]) => ({
    label,
    value,
  }));

  // Derive kilowatt in kW from either explicit field or computed fields
  const deriveKilowatt = (it) => {
    const explicit = Number(it?.kilowatt);
    if (Number.isFinite(explicit) && explicit > 0) return explicit;

    const numberOfPanels = Number(it?.numberOfPanel);
    const panelCapacityInput = Number(it?.panelCapacity);
    if (
      !Number.isFinite(numberOfPanels) ||
      !Number.isFinite(panelCapacityInput)
    )
      return null;

    // Heuristic: panelCapacity >= 100 → value given in Watts; otherwise in kW
    const isCapacityInWatts = panelCapacityInput >= 100;
    const totalCapacityKw = isCapacityInWatts
      ? (numberOfPanels * panelCapacityInput) / 1000
      : numberOfPanels * panelCapacityInput;

    if (!Number.isFinite(totalCapacityKw) || totalCapacityKw <= 0) return null;
    return totalCapacityKw;
  };

  const isInKilowattRange = (kw, rangeLabel) => {
    if (!Number.isFinite(kw)) return false;
    if (!rangeLabel) return true;
    if (rangeLabel.endsWith("+")) {
      const min = Number(rangeLabel.replace("+", ""));
      return kw >= min;
    }
    const [minStr, maxStr] = rangeLabel.split("-");
    const min = Number(minStr);
    const max = Number(maxStr);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return true;
    return kw >= min && kw <= max;
  };

  // Filtering
  const filteredData = data.filter((item) => {
    const text = searchText.toLowerCase();
    const matchesSearch =
      item.name?.toLowerCase().includes(text) ||
      `${item.phone || ""}`.toLowerCase().includes(text) ||
      `${item.mobil || ""}`.toLowerCase().includes(text);

    const matchesFilter =
      selectedFilter.length > 0 ? selectedFilter.includes(item.status) : true;

    const matchesCity = selectedCity ? item.city === selectedCity : true;

    const kwValue = deriveKilowatt(item);
    const matchesKilowatt = selectedKilowatt
      ? isInKilowattRange(kwValue, selectedKilowatt)
      : true;

    const matchesCustomerType = selectedCustomerType
      ? item.customerType === selectedCustomerType
      : true;
    const matchesStatus = selectedStatus
      ? item.status === selectedStatus
      : true;

    return (
      matchesSearch &&
      matchesFilter &&
      matchesCity &&
      matchesKilowatt &&
      matchesCustomerType &&
      matchesStatus
    );
  });

  // Sort by createdAt based on sortOrder (desc = newest first, asc = oldest first)
  const displayedData = [...filteredData].sort((a, b) => {
    const timeA = new Date(a?.createdAt).getTime() || 0;
    const timeB = new Date(b?.createdAt).getTime() || 0;
    if (sortOrder === "asc") return timeA - timeB; // oldest first
    return timeB - timeA; // newest first
  });

  // Card UI
  const renderItem = ({ item, index }) => {
    const statusInfo = statusMap[item.status] || {
      label: item.status,
      color: "#333",
    };
    const noteValueRaw = noteById[item._id] ?? "";
    const hasNote = Boolean((noteValueRaw || "").trim());
    const isEditing =
      typeof editingById[item._id] === "boolean"
        ? editingById[item._id]
        : !hasNote;

    const computedKilowatt = (() => {
      const kw = deriveKilowatt(item);
      if (!Number.isFinite(kw) || kw <= 0) return null;
      return kw.toFixed(3);
    })();

    const computedGrandTotal = (() => {
      // Mirror PDF totals
      const kw = Number(deriveKilowatt(item) || 0);
      const ratePerPanel = Number(item?.ratePerPanel) || 0;
      const gstPercent = Number(item?.gst) || 0;
      const noOfMeter = Number(item?.noOfMeter) || 1;
      const meterCharge = Number(item?.meterCharge) || 0;
      const structureCharge = Number(item?.structureCharge) || 0;
      const panelBrandCharge = Number(item?.panelBrandCharge) || 0;
      const inverterCharge = Number(item?.inverterCharge) || 0;
      const customerType = (item?.customerType || "").toLowerCase();

      const taxableAmount = Number((ratePerPanel * kw).toFixed(2));
      const totalWithTax = Number(
        (taxableAmount + (taxableAmount * gstPercent) / 100).toFixed(2)
      );
      const totalMeterCharge = Number((noOfMeter * meterCharge).toFixed(2));
      const totalStructureCharge = Number((structureCharge * kw).toFixed(2));
      const totalPanelBrandCharge = Number((panelBrandCharge * kw).toFixed(2));
      const totalInverterBrandCharge = Number(inverterCharge.toFixed(2));

      const totalWithSubsidy = Number(
        (
          (totalWithTax || 0) +
          (totalMeterCharge || 0) +
          (totalStructureCharge || 0) +
          (totalPanelBrandCharge || 0) +
          (totalInverterBrandCharge || 0)
        ).toFixed(2)
      );

      // Subsidy calculation per pdfpdf.js
      let subsidyAmountNum = 0;
      const kwRounded = Number(kw.toFixed(2));
      if (customerType === "household") {
        if (kwRounded <= 2) {
          subsidyAmountNum = Number((kwRounded * 30000).toFixed(2));
        } else if (kwRounded > 2) {
          if (kwRounded > 3) {
            subsidyAmountNum = Number((2 * 30000 + 1 * 18000).toFixed(2));
          } else if (kwRounded <= 3) {
            subsidyAmountNum = Number(
              (2 * 30000 + (kwRounded - 2) * 18000).toFixed(2)
            );
          }
        }
      } else if (customerType === "org") {
        subsidyAmountNum = Number((kwRounded * 18000).toFixed(2));
      } else if (customerType === "commercial") {
        subsidyAmountNum = 0;
      }

      const grandTotal = Number(
        (totalWithSubsidy - subsidyAmountNum).toFixed(2)
      );
      if (!Number.isFinite(grandTotal) || grandTotal <= 0) return null;
      return grandTotal.toFixed(2);
    })();
    return (
      <View
        style={{
          width: WP(95),
          backgroundColor: "#fff",
          alignSelf: "center",
          padding: HP(3),
          borderRadius: HP(2),
          marginTop: HP(2),
          elevation: 5,
          marginBottom: index === filteredData.length - 1 ? HP(8) : 0,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text
                  style={{ fontSize: FS(2), fontWeight: "bold", color: "#333" }}
                >
                  {item.name}
                </Text>
                <Text style={styles.infoText}>
                  {/* Mobil -{" "} */}
                  <Text style={styles.infoText}>+91 {item.phone}</Text>
                </Text>
                <Text style={styles.infoText}>
                  Capacity -{" "}
                  <Text style={{ color: "#555" }}>
                    {computedKilowatt !== null ? computedKilowatt : "-"} kw
                  </Text>
                </Text>

                <Text style={styles.infoText}>
                  Total Price -{" "}
                  <Text style={{ color: "#555" }}>{computedGrandTotal}</Text>
                </Text>
              </View>
              <Text
                style={{
                  color: statusInfo.color,
                  fontWeight: "bold",
                  fontSize: FS(1.8),
                  position: "absolute",
                  top: 0,
                  right: WP(0),
                  top: HP(3.5),
                }}
              >
                {statusInfo.label}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: WP(15),
                  marginTop: HP(5),
                  top: HP(1),
                }}
              >
                <TouchableOpacity>
                  <Icon name="eye" size={25} color={"#333"} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (item?.quotationPdfUrl) {
                      Linking.openURL(item.quotationPdfUrl);
                    } else {
                      Alert.alert(
                        "PDF not available",
                        "No PDF link found for this quotation."
                      );
                    }
                  }}
                >
                  <PdF name="file-pdf" size={25} color={"#333"} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Inline Note display with edit/submit */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {!isEditing ? <Text style={styles.infoText}>Note</Text> : null}
              {isEditing ? (
                <>
                  <TextInput
                    placeholder="Add note"
                    value={noteById[item._id] ?? ""}
                    onChangeText={(t) =>
                      setNoteById((prev) => ({ ...prev, [item._id]: t }))
                    }
                    style={{
                      backgroundColor: "#f7f7f7",
                      borderRadius: 6,
                      padding: 10,
                      color: "#333",
                      marginTop: HP(0.5),
                      width: WP(62),
                    }}
                    placeholderTextColor={"gray"}
                    multiline
                  />
                  <TouchableOpacity
                    style={{
                      marginTop: HP(1),
                      backgroundColor: Colors.primary,
                      paddingVertical: HP(1),
                      paddingHorizontal: HP(2),
                      borderRadius: 5,
                      alignSelf: "flex-start",
                      marginLeft: WP(4),
                    }}
                    onPress={() => submitNote(item._id)}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View
                  style={{
                    marginTop: HP(0.5),
                    // backgroundColor: "#f7f7f7",
                    borderRadius: 6,
                    padding: 10,
                    width: WP(75),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "#333", flex: 1 }}>
                      {hasNote ? noteById[item._id] : "-"}
                    </Text>
                    <TouchableOpacity
                      style={{
                        marginLeft: 10,
                        backgroundColor: "#e0e0e0",
                        paddingVertical: HP(0.5),
                        paddingHorizontal: HP(1.5),
                        borderRadius: 5,
                      }}
                      onPress={() =>
                        setEditingById((prev) => ({
                          ...prev,
                          [item._id]: true,
                        }))
                      }
                    >
                      <Text style={{ color: "#333", fontWeight: "bold" }}>
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Bottom Button */}
        <View
          style={{
            flexDirection: "row",
            marginTop: HP(2),
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: HP(1),
                backgroundColor: Colors.primary,
                borderRadius: 5,
                width: WP(8),
                height: HP(3.5),
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                Linking.openURL(`tel:${item?.phone}`);
              }}
            >
              <Icon name="call" color={"#fff"} />
              {/* <Text style={{ color: "#fff", fontWeight: "bold" }}>Call</Text> */}
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: WP(0.4) }}
              onPress={() => {
                Linking.openURL(`whatsapp://send?phone=${item?.phone}`);
              }}
            >
              <Image
                style={{ resizeMode: "contain", height: HP(5), width: HP(5) }}
                source={require("../assets/wtups.png")}
              ></Image>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              marginTop: HP(1),
              backgroundColor: Colors.primary,
              paddingVertical: HP(1),
              paddingHorizontal: HP(2),
              borderRadius: 5,
              alignSelf: "flex-start",
            }}
            onPress={() => {
              setStatusChangeItem(item);
              setStatusModalVisible(true);
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Change Status
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={statusModalVisible}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setStatusModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Status</Text>
              <ScrollView>
                {Object.entries(statusMap).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    style={{
                      padding: 15,
                      borderRadius: 5,
                      backgroundColor:
                        statusChangeItem?.status === key
                          ? value.color
                          : "#f0f0f0",
                      marginBottom: 10,
                    }}
                    onPress={async () => {
                      try {
                        await apiCalls.updateLead(statusChangeItem._id, {
                          ...statusChangeItem, // Include all existing data
                          status: key,
                        });
                        setStatusModalVisible(false);
                        fetchQuotations();
                      } catch (e) {
                        console.error(e);
                        Alert.alert("Error", "Failed to update status");
                      }
                    }}
                  >
                    <Text
                      style={{
                        color:
                          statusChangeItem?.status === key ? "#fff" : "#333",
                        fontWeight: "bold",
                      }}
                    >
                      {value.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Quotation")}
        style={{
          position: "absolute",
          bottom: HP(11),
          right: WP(4),
          height: HP(6),
          width: HP(6),
          borderRadius: HP(3),
          backgroundColor: "#FF9800",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
          elevation: 5,
        }}
      >
        <Feather name="plus" size={30} color={"#fff"} />
      </TouchableOpacity>
      <ImageBackground source={require("../assets/backGround.png")}>
        {/* Header */}
        <View
          style={{ flexDirection: "row", alignItems: "center", padding: HP(2) }}
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
              fontSize: FS(2.5),
              fontWeight: "bold",
              color: "#333",
            }}
          >
            View Quotation
          </Text>
        </View>

        {/* Search Bar */}
        <CusSearch
          TextVal={searchText}
          onchange={(text) => setSearchText(text)}
          onp={() => setVisible(true)}
        />

        {/* List */}
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: HP(5),
            }}
          >
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text
              style={{ marginTop: HP(1), color: "#333", fontWeight: "bold" }}
            >
              Loading quotations...
            </Text>
          </View>
        ) : (
          <FlatList
            renderItem={renderItem}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={fetchQuotations}
              />
            }
            data={displayedData}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: HP(10) }}
            ListEmptyComponent={
              !loading && (
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: HP(5),
                    fontSize: FS(2),
                    color: "#555",
                  }}
                >
                  No quotations found
                </Text>
              )
            }
          />
        )}

        {/* Filter Modal */}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <Pressable style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.modalTitle}>Filter Options</Text>
                  <TouchableOpacity onPress={() => setVisible(false)}>
                    <Icon name="close" size={25} color={"#333"} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <View style={{ marginRight: WP(8) }}>
                    <Text style={styles.infoText}>Sort By</Text>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={sortOrder}
                        onValueChange={(value) => setSortOrder(value)}
                        style={{ color: "#333" }}
                      >
                        <Picker.Item label="Newest First" value="desc" />
                        <Picker.Item label="Oldest First" value="asc" />
                      </Picker>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.infoText}>Page Limit</Text>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={limit}
                        onValueChange={(value) => setLimit(value)}
                        style={{ color: "#333" }}
                      >
                        <Picker.Item label="10 per page" value={10} />
                        <Picker.Item label="25 per page" value={25} />
                        <Picker.Item label="50 per page" value={50} />
                      </Picker>
                    </View>
                  </View>
                </View>
                {/* Kilowatt, City, Customer Type */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Kilowatt */}
                  <View>
                    <Text style={styles.infoText}>Kilowatt</Text>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={selectedKilowatt}
                        onValueChange={(value) => setSelectedKilowatt(value)}
                        style={{ height: HP(5), width: WP(40), color: "#333" }}
                      >
                        <Picker.Item label="All" value="" />
                        {["0-5", "5-10", "10-15", "15-20", "20+"].map((kw) => (
                          <Picker.Item label={kw} value={kw} key={kw} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                  {/* City */}
                  <View>
                    <Text style={styles.infoText}>City</Text>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={selectedCity}
                        onValueChange={(value) => setSelectedCity(value)}
                        style={{ height: HP(5), width: WP(40), color: "#333" }}
                      >
                        <Picker.Item label="All" value="" />
                        {cityOptions.map((city) => (
                          <Picker.Item label={city} value={city} key={city} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                  {/* Customer Type */}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text style={styles.infoText}>Customer Type</Text>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={selectedCustomerType}
                        onValueChange={(value) =>
                          setSelectedCustomerType(value)
                        }
                        style={{ height: HP(5), width: WP(40), color: "#333" }}
                      >
                        <Picker.Item label="All" value="" />
                        {(customerTypeOptions.length
                          ? customerTypeOptions
                          : ["Household", "Organization", "Commercial"]
                        ).map((type) => (
                          <Picker.Item label={type} value={type} key={type} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.infoText}>Status</Text>
                    <View style={styles.pickerBox}>
                      <Picker
                        selectedValue={selectedStatus}
                        onValueChange={(value) => setSelectedStatus(value)}
                        style={{ height: HP(5), width: WP(40), color: "#333" }}
                      >
                        <Picker.Item label="All" value="" />
                        {statusData.map((s) => (
                          <Picker.Item
                            label={s.label}
                            value={s.value}
                            key={s.value}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
                {/* Status Buttons */}

                {/* Clear & Apply */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: HP(2),
                  }}
                >
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={() => {
                      setSelectedFilter([]);
                      setSelectedCity("");
                      setSelectedKilowatt("");
                      setSelectedCustomerType("");
                      setSelectedStatus("");
                    }}
                  >
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => setVisible(false)}
                  >
                    <Text style={{ color: "#fff", fontSize: 16 }}>
                      Apply Filters
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </Modal>

        {/* Status Change Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={statusModalVisible}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setStatusModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Status</Text>
              <ScrollView>
                {Object.entries(statusMap).map(([key, value]) => (
                  <TouchableOpacity
                    key={key}
                    style={{
                      padding: 15,
                      borderRadius: 5,
                      backgroundColor:
                        statusChangeItem?.status === key
                          ? value.color
                          : "#f0f0f0",
                      marginBottom: 10,
                    }}
                    onPress={async () => {
                      try {
                        await apiCalls.updateQuotation(statusChangeItem._id, {
                          status: key,
                          note: statusChangeItem.note || "",
                        });
                        setStatusModalVisible(false);
                        fetchQuotations();
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                  >
                    <Text
                      style={{
                        color:
                          statusChangeItem?.status === key ? "#fff" : "#333",
                        fontWeight: "bold",
                      }}
                    >
                      {value.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  infoText: {
    marginTop: HP(1),
    color: "#000",
    fontWeight: "bold",
    fontSize: FS(1.8),
  },
  searchBox: {
    elevation: 5,
    margin: HP(1),
    backgroundColor: "#fff",
    borderRadius: HP(1),
    width: WP(75),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    right: WP(2),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    flex: 0.5,
    backgroundColor: "#fff",
    paddingTop: HP(3),
    borderTopLeftRadius: HP(3),
    borderTopRightRadius: HP(3),
    paddingLeft: WP(5),
    paddingRight: WP(5),
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: HP(1),
    color: "#333",
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: HP(1),
    width: WP(40),
  },
  clearBtn: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  clearText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
});
