import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  ImageBackground,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { FS, HP, WP } from "../utils/Dimention";
import { apiCalls } from "../api/api";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Colors from "../utils/Colors";
import CusSearch from "../components/CusSearch";

export default function ViewLead({ route, navigation }) {
  const { leads = [], removedLeadId } = route.params || {};

  console.log("data=-=-=-=", data);

  const statusMap = {
    newLead: { label: "New Lead", color: "#17a2b8" }, // blue-ish
    inProgress: { label: "In Progress", color: "#FFA500" }, // orange
    siteVisitScheduled: { label: "Site Visit Scheduled", color: "#007bff" }, // blue
    siteVisitDone: { label: "Site Visit Done", color: "#28a745" }, // green
    leadLost: { label: "Lead Lost", color: "#dc3545" }, // red
  };

  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [modalVisible, setVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusChangeItem, setStatusChangeItem] = useState(null);
  const [noteById, setNoteById] = useState({});
  const [editingById, setEditingById] = useState({});
  const [searchText, setSearchText] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  // Initialize notes when data is fetched
  useEffect(() => {
    const initialNotes = {};
    data.forEach((item) => {
      if (item.note) {
        initialNotes[item._id] = item.note;
      }
    });
    setNoteById((prev) => ({ ...prev, ...initialNotes }));
  }, [data]);

  // --- submit note ---
  const submitNote = async (id) => {
    try {
      await apiCalls.updateLead(id, { note: noteById[id] ?? "" });
      setEditingById((prev) => ({ ...prev, [id]: false }));
      // Optionally refresh if server mutates other fields
      fetchQuotations();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to save note");
    }
  };

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await apiCalls.CreateView();
      console.log("API RESPONSE =>", response);

      let leads = [];

      if (Array.isArray(response)) {
        leads = response;
      } else if (response?.leads && Array.isArray(response.leads)) {
        leads = response.leads;
      } else if (response?.data && Array.isArray(response.data)) {
        leads = response.data;
      }

      const uniqueLeads = leads.filter(
        (lead, index, self) =>
          index === self.findIndex((l) => l._id === lead._id)
      );

      setAllData(uniqueLeads);
      setData(uniqueLeads);
    } catch (err) {
      console.error("Error fetching quotations:", err.message);
      setError("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchQuotations();
    }, [])
  );

  useEffect(() => {
    if (removedLeadId) {
      setData((prev) => prev.filter((item) => item._id !== removedLeadId));
    }
  }, [removedLeadId]);
  // console.log("LEADS DATA >>>", data);

  return (
    <ImageBackground
      source={require("../assets/backGround.png")}
      style={{ flex: 1 }}
    >
      {/* Floating Add Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("CreatLead")}
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
            fontSize: 25,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Leads
        </Text>
      </View>
      <CusSearch
        TextVal={searchText}
        onchange={(text) => setSearchText(text)}
        onp={() => setFilterModalVisible(true)}
      />
      {/* Loader / Error / Empty State / Data */}
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
          <Text style={{ marginTop: 10, color: "#333", fontWeight: "bold" }}>
            Loading leads...
          </Text>
        </View>
      ) : error ? (
        <Text style={{ color: "red", alignSelf: "center", marginTop: HP(5) }}>
          {error}
        </Text>
      ) : data.length === 0 ? (
        <Text
          style={{
            color: "#333",
            alignSelf: "center",
            justifyContent: "center",
            marginTop: HP(5),
          }}
        >
          No leads added yet.
        </Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data.filter((item) => {
            if (!searchText.trim()) return true; // no search → show all
            const search = searchText.toLowerCase();
            return (
              item.name?.toLowerCase().includes(search) ||
              item.phone?.toString().includes(search) ||
              item.address?.toLowerCase().includes(search)
            );
          })}
          keyExtractor={(item, index) =>
            item._id || item.id || index.toString()
          }
          renderItem={({ item, index }) => {
            const statusInfo = statusMap[item.leadStatus] || {
              label: item.leadStatus || "Unknown",
              color: "#333",
            };
            const noteValueRaw = noteById[item._id] ?? "";
            const hasNote = Boolean((noteValueRaw || "").trim());
            const isEditing =
              typeof editingById[item._id] === "boolean"
                ? editingById[item._id]
                : !hasNote;

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
                  marginBottom: index === data.length - 1 ? HP(8) : 0,
                }}
              >
                {/* --- HEADER --- */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: FS(2),
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Text style={styles.infoText}>+91 {item.phone}</Text>
                    <Text style={styles.infoText}>
                      Add :{" "}
                      <Text style={{ color: "#555" }}>{item.address}</Text>
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
                </View>

                {/* --- NOTES --- */}
                <View style={{ marginTop: HP(1) }}>
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
                          width: WP(70),
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
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={[
                          styles.infoText,
                          { right: WP(0), bottom: HP(0.5) },
                        ]}
                      >
                        Note :{" "}
                      </Text>
                      <Text
                        style={{
                          color: "#333",
                          flex: 1,
                          fontWeight: "600",
                          fontSize: FS(1.8),
                        }}
                      >
                        {hasNote ? noteById[item._id] : item.note || "-"}
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
                  )}
                </View>

                {/* --- BOTTOM BUTTONS --- */}
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
                        const countryCode = "+91"; // change to dynamic if needed
                        const phoneNumber = `${countryCode}${item?.phone}`;
                        Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
                      }}
                    >
                      <Image
                        style={{
                          resizeMode: "contain",
                          height: HP(5),
                          width: HP(5),
                        }}
                        source={require("../assets/wtups.png")}
                      ></Image>
                    </TouchableOpacity>
                  </View>

                  {/* Change Status */}
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
                  <TouchableOpacity
                    style={{
                      marginTop: HP(1),
                      backgroundColor: Colors.primary,
                      paddingVertical: HP(1),
                      paddingHorizontal: HP(1),
                      borderRadius: 5,
                      alignSelf: "flex-start",
                      left: WP(2),
                    }}
                    onPress={() => {
                      navigation.navigate("Quotation", {
                        lead: item,
                      });
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Create Quotation
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* --- FILTER MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Status</Text>
            <ScrollView>
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => {
                  setData(allData); // reset
                  setFilterModalVisible(false);
                }}
              >
                <Text style={styles.clearText}>All Leads</Text>
              </TouchableOpacity>

              {Object.entries(statusMap).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={{
                    padding: 15,
                    borderRadius: 5,
                    backgroundColor: "#f0f0f0",
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    const filtered = allData.filter(
                      (item) =>
                        item?.leadStatus?.toLowerCase() === key.toLowerCase()
                    );
                    setData(filtered);
                    setFilterModalVisible(false);
                  }}
                >
                  <Text style={{ color: value.color, fontWeight: "bold" }}>
                    {value.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* --- STATUS MODAL --- */}
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
                      statusChangeItem?.leadStatus === key
                        ? value.color
                        : "#f0f0f0",
                    marginBottom: 10,
                  }}
                  onPress={async () => {
                    try {
                      await apiCalls.updateLead(statusChangeItem._id, {
                        leadStatus: key,
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
                        statusChangeItem?.leadStatus === key ? "#fff" : "#333",
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
  clearBtn: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
    marginVertical: HP(1),
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
