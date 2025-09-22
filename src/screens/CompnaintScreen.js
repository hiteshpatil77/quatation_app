import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  ImageBackground,
  Modal,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { FS, HP, WP } from "../utils/Dimention";
import { apiCalls } from "../api/api";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../utils/Colors";
import Feather from "react-native-vector-icons/Feather";
import CusSearch from "../components/CusSearch";

export default function ComplaintScreen({ route, navigation }) {
  const { leads = [], removedLeadId } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [error, setError] = useState(null);
  const [noteById, setNoteById] = useState({});
  const [statusChangeItem, setStatusChangeItem] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setVisible] = useState(false);
  const [editingById, setEditingById] = useState({});
  console.log("data=-=-=-=", data);
  useEffect(() => {
    const initialNotes = {};
    data.forEach((item) => {
      if (item.note) {
        initialNotes[item._id] = item.note;
      }
    });
    setNoteById((prev) => ({ ...prev, ...initialNotes }));
  }, [data]);

  const submitNote = async (id) => {
    try {
      await apiCalls.updateComplaint(id, { note: noteById[id] ?? "" });
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
      const response = await apiCalls.getComplaint();

      if (response && response.complaints) {
        const uniqueLeads = response.complaints.filter(
          (lead, index, self) =>
            index === self.findIndex((l) => l._id === lead._id)
        );
        setAllData(uniqueLeads);
        setData(uniqueLeads);
      } else if (response?.data) {
        setAllData(response.data);
        setData(response.data);
      } else {
        setAllData([]);
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching quotations:", err.message);
      setError("Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  const statusMap = {
    open: { label: "Open", color: "orange", value: "open" },
    inProgress: { label: "In Progress", color: "blue", value: "inProgress" },
    resolved: { label: "Resolved", color: "green", value: "resolved" },
    closed: { label: "Closed", color: "red", value: "closed" },
    reopened: { label: "Reopened", color: "orange", value: "reopened" },
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // Refresh list whenever screen comes into focus (e.g., after creating a quotation)
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

  return (
    <ImageBackground
      source={require("../assets/backGround.png")}
      style={{ flex: 1 }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Support")}
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
          Complaints
        </Text>
      </View>
      <CusSearch
        TextVal={searchText}
        onchange={(text) => setSearchText(text)}
        onp={() => setVisible(true)}
      />
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
       >
        <View style={styles.searchBox}>
          <Icon name="search" size={22} color={"gray"} />
          <TextInput
            placeholder="Search Order"
            style={{ flex: 1, marginLeft: 8, color: "#333" }}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            placeholderTextColor={"gray"}
          />
        </View>
        <TouchableOpacity
          style={{
            padding: HP(1.5),
            backgroundColor: "#fff",
            borderRadius: HP(1.5),
            elevation: 5,
          }}
          onPress={() => setVisible(true)}
        >
          <Icon name="menu" size={25} color="#333" />
        </TouchableOpacity>
      </View> */}
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
              item.phone?.toString().includes(search)
            );
          })}
          keyExtractor={(item) => item._id}
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
                  backgroundColor: "#fff",
                  padding: HP(2),
                  marginVertical: 8,
                  borderRadius: 10,
                  elevation: 3,
                  margin: HP(2),
                  marginBottom: index === data.length - 1 ? HP(8) : 0,
                }}
              >
                <Text
                  style={{ fontSize: FS(2), fontWeight: "600", color: "#333" }}
                >
                  {item.name}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: FS(2),
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    Mo {item.phone}
                  </Text>
                  <Text
                    style={{
                      fontSize: FS(2),
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {item.priority}
                  </Text>

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#eee",
                      padding: 5,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      setStatusChangeItem(item);
                      setStatusModalVisible(true);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: FS(2),
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      {item.status}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{ fontSize: FS(2), fontWeight: "600", color: "#333" }}
                >
                  Add. - {item.address}
                </Text>
                <Text
                  style={{ fontSize: FS(2), fontWeight: "600", color: "#333" }}
                >
                  City - {item.city}
                </Text>
                <Text
                  style={{ fontSize: FS(2), fontWeight: "600", color: "#333" }}
                >
                  Description - {item.description}
                </Text>
                <Text
                  style={{ fontSize: FS(2), fontWeight: "600", color: "#333" }}
                >
                  Cat. - {item.category}
                </Text>
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {/* <Text
                  style={{ fontSize: FS(2), fontWeight: "600", color: "#333" }}
                >
                  Des. - {item.description}
                </Text> */}
                </View>
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
                      justifyContent: "space-between",
                      width: WP(20),
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        marginTop: HP(1),
                        backgroundColor: Colors.primary,

                        borderRadius: 5,
                        // alignSelf: "flex-start",
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
                        style={{
                          resizeMode: "contain",
                          height: HP(5),
                          width: HP(5),
                        }}
                        source={require("../assets/wtups.png")}
                      ></Image>
                      {/* <Text style={{ color: "#fff", fontWeight: "bold" }}>WhatsApp</Text> */}
                    </TouchableOpacity>
                  </View>
                  {/* <TouchableOpacity
                  style={{
                    marginTop: 10,
                    alignItems: "center",
                    backgroundColor: Colors.primary,
                    padding: 8,
                    borderRadius: 5,
                  }}
                  // onPress={() =>
                  //   navigation.navigate("Quotation", { lead: item })
                  // }
                >
                  <Text style={{ color: "#fff" }}>Create Quotation</Text>
                </TouchableOpacity> */}
                </View>
                {/* <TouchableOpacity
                style={{
                  marginTop: 10,
                  alignItems: "center",
                  backgroundColor: Colors.primary,
                  padding: 8,
                  borderRadius: 5,
                }}
                onPress={() => navigation.navigate("Quotation", { lead: item })}
              >
                <Text style={{ color: "#fff" }}>Create Quotation</Text>
              </TouchableOpacity> */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={statusModalVisible}
                  onRequestClose={() => setStatusModalVisible(false)}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                  >
                    <View
                      style={{
                        width: "80%",
                        backgroundColor: "#fff",
                        padding: 20,
                        borderRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          marginBottom: 15,
                        }}
                      >
                        Update Status
                      </Text>

                      {[
                        "open",
                        "inProgress",
                        "resolved",
                        "closed",
                        "reopened",
                      ].map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={{
                            padding: 12,
                            marginVertical: 5,
                            borderRadius: 5,
                            backgroundColor:
                              statusChangeItem?.status === status
                                ? Colors.primary
                                : "#eee",
                          }}
                          onPress={async () => {
                            try {
                              await apiCalls.updateComplaint(
                                statusChangeItem._id,
                                {
                                  status,
                                }
                              );
                              setData((prev) =>
                                prev.map((item) =>
                                  item._id === statusChangeItem._id
                                    ? { ...item, status }
                                    : item
                                )
                              );
                              setStatusModalVisible(false);
                            } catch (e) {
                              console.error(
                                "Error updating complaint:",
                                e.message
                              );
                            }
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              color:
                                statusChangeItem?.status === status
                                  ? "#fff"
                                  : "#333",
                            }}
                          >
                            {status}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </Modal>
              </View>
            );
          }}
        />
      )}
      {/* --- FILTER MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Leads</Text>
            <ScrollView>
              <TouchableOpacity
                style={styles.filterOption}
                onPress={() => {
                  setSearchText("");
                  setData(allData); // reset to original
                  setVisible(false);
                }}
              >
                <Text style={styles.filterText}>All Complaints</Text>
              </TouchableOpacity>

              {Object.entries(statusMap).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={styles.filterOption}
                  onPress={() => {
                    const filtered = allData.filter(
                      (item) =>
                        item?.status?.toLowerCase() ===
                        value.value.toLowerCase()
                    );
                    setData(filtered);
                    setVisible(false);
                  }}
                >
                  <Text style={[styles.filterText, { color: value.color }]}>
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
    flex: 0.45,
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
  filterOption: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
