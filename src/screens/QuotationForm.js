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
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {pdfpdf} from '../assets/pdfpdf';
import {Formik} from 'formik';
import CsButton from '../components/CustomeButton';
import {Dropdown} from 'react-native-element-dropdown';
import {useState} from 'react';
import FileViewer from 'react-native-file-viewer';

export default function Pddf() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isFocus, setIsFocus] = useState(false);

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };
  const createPDF = async data => {
    try {
      const htmlString = pdfpdf(data);
      const today = new Date();
      let PDFOptions = {
        html: `${htmlString}`,
        fileName: `${data.CustomerName.split(' ')[0]}_${today.getDate()}_${
          today.getMonth() + 1
        }-${today.getHours()}_${today.getMinutes()}`,
        directory: Platform.OS === 'android' ? 'Downloadss' : 'Documents',
        base64: true,
      };
      let file = await RNHTMLtoPDF.convert(PDFOptions);

      if (!file.filePath) return;
      Alert.alert('stored successfully', 'PDF File', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Open',
          onPress: () => {
            openFile(file.filePath);
          },
        },
      ]);

      const openFile = path => {
        FileViewer.open(path, {
          displayName: 'string',
          showAppsSuggestions: true,
          showOpenWithDialog: true,
        }) // absolute-path-to-my-local-file.
          .then(() => {
            // success
          })
          .catch(error => {
            // error
            Alert.alert('Error While Opening File:', error.message);
          });
      };
    } catch (error) {
      Alert.alert('Failed to generate pdf:', error.message);
    }
  };

  const panelBrandDetail = [
    {label: 'ADANI', value: 1},
    {label: 'WAARE', value: 2},
    {label: 'GOLDI', value: 3},
    {label: 'PAHAL', value: 4},
    {label: 'REYZON', value: 5},
    {label: 'TATA', value: 6},
  ];
  const inverterBrandDetail = [
    {label: 'K SOLAR'},
    {label: 'DEYE'},
    {label: 'V SOLE'},
    {label: 'MINDRA'},
    {label: 'X WATT'},
    {label: 'OTHER'},
  ];
  const getPanelCapacityRange = () => {
    const from = 540;
    const to = 650;
    const array = [];
    for (let i = from; i <= to; i += 5) {
      array.push({label: `${i}`});
    }
    return array;
  };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={[
            {
              backgroundColor: Colors.white,
            },
            styles.container,
          ]}>
          <Formik
            initialValues={{
              ConsumerNumber: '-',
              CustomerName: '',
              CustomerAddress: '',
              CustomerEmail: '',
              CustomerMobile: '',
              Customertype: 'House-Hold',
              panelBrandName: `${panelBrandDetail[0].label}`,
              panelBrandCharges: '1000',
              NoOfPanel: '1',
              sellingRate: '42000',
              panelWattPeak: '575',
              inverterBrand: `${inverterBrandDetail[0].label}`,
              inverterCapacity: '3.2',
              inverterCharges: '0',
              structureCharges: '4000',
              meterCharges: '3350',
              gstPercent: '13.8',
              noOfMeter: '1',
              noOfPhase: '1',
            }}
            onSubmit={values => {
              createPDF(values);
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              setFieldValue,
            }) => (
              <>
                <Text style={styles.inputLable}>Consumer Number</Text>
                <TextInput
                  placeholder="Enter Consumer Number"
                  placeholderTextColor={'gray'}
                  value={values.ConsumerNumber}
                  onChangeText={handleChange('ConsumerNumber')}
                  onBlur={handleBlur('ConsumerNumber')}
                  style={styles.inputText}
                />
                <Text style={styles.inputLable}>Name</Text>
                <TextInput
                  placeholder="Jams Bond"
                  placeholderTextColor={'gray'}
                  value={values.CustomerName}
                  onChangeText={handleChange('CustomerName')}
                  onBlur={handleBlur('CustomerName')}
                  style={styles.inputText}
                />
                <Text style={styles.inputLable}>Address</Text>

                <TextInput
                  placeholder="Jams Bond"
                  placeholderTextColor={'gray'}
                  value={values.CustomerAddress}
                  onChangeText={handleChange('CustomerAddress')}
                  onBlur={handleBlur('CustomerAddress')}
                  style={styles.inputText}
                />
                <Text style={styles.inputLable}>Email</Text>

                <TextInput
                  placeholder="Email@mail.com"
                  placeholderTextColor={'gray'}
                  value={values.CustomerEmail}
                  onChangeText={handleChange('CustomerEmail')}
                  onBlur={handleBlur('CustomerEmail')}
                  style={styles.inputText}
                />

                <Text style={styles.inputLable}>Phone Number</Text>

                <TextInput
                  placeholder="9xxxxxxxx0"
                  placeholderTextColor={'gray'}
                  value={values.CustomerMobile}
                  onChangeText={handleChange('CustomerMobile')}
                  onBlur={handleBlur('CustomerMobile')}
                  style={styles.inputText}
                  keyboardType="number-pad"
                />

                <Text style={styles.inputLable}>Customer Type</Text>

                <Dropdown
                  style={[styles.inputText, isFocus && {borderColor: 'blue'}]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={{color: 'black'}}
                  data={[
                    {label: 'House-Hold'},
                    {label: 'Organization'},
                    {label: 'Commercial'},
                  ]}
                  // search
                  maxHeight={300}
                  labelField="label"
                  valueField="label"
                  placeholder={
                    values.Customertype ? values.Customertype : 'Select item'
                  }
                  // searchPlaceholder="Search..."
                  onChange={item => {
                    setFieldValue('Customertype', item.label);
                  }}
                />

                <Text style={styles.inputLable}>Panel Brand</Text>

                <Dropdown
                  style={[styles.inputText, isFocus && {borderColor: 'blue'}]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={{color: 'black'}}
                  data={panelBrandDetail}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="label"
                  placeholder={
                    values.panelBrandName
                      ? values.panelBrandName
                      : 'Select item'
                  }
                  searchPlaceholder="Search..."
                  onChange={item => {
                    setFieldValue('panelBrandName', item.label);
                  }}
                />

                <Text style={styles.inputLable}>Panel Brand Charge</Text>

                <TextInput
                  name="panelBrandCharges"
                  placeholder="1000"
                  placeholderTextColor={'gray'}
                  value={values.panelBrandCharges}
                  onChangeText={handleChange('panelBrandCharges')}
                  onBlur={handleBlur('panelBrandCharges')}
                  style={styles.inputText}
                  keyboardType="number-pad"
                />

                <Text style={styles.inputLable}>Number Of Panel</Text>

                <Dropdown
                  style={[styles.inputText, isFocus && {borderColor: 'blue'}]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={{color: 'black'}}
                  data={Array.from({length: 100}, (_, i) => {
                    return {label: `${i + 1}`};
                  })}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="label"
                  placeholder={
                    values.NoOfPanel ? values.NoOfPanel : 'Select item'
                  }
                  searchPlaceholder="Search..."
                  onChange={item => {
                    setFieldValue('NoOfPanel', item.label);
                  }}
                />

                <Text style={styles.inputLable}>Panel Capacity</Text>

                <Dropdown
                  style={[styles.inputText, isFocus && {borderColor: 'blue'}]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={{color: 'black'}}
                  data={getPanelCapacityRange()}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="label"
                  placeholder={
                    values.panelWattPeak ? values.panelWattPeak : 'Select item'
                  }
                  searchPlaceholder="Search..."
                  onChange={item => {
                    setFieldValue('panelWattPeak', item.label);
                  }}
                />

                <Text style={styles.inputLable}>Rate per Panel</Text>

                <TextInput
                  name="sellingRate"
                  placeholder="0"
                  placeholderTextColor={'gray'}
                  value={values.sellingRate}
                  onChangeText={handleChange('sellingRate')}
                  onBlur={handleBlur('sellingRate')}
                  style={styles.inputText}
                  keyboardType="number-pad"
                />

                <Text style={styles.inputLable}>Inverter Brand</Text>

                <Dropdown
                  style={[styles.inputText, isFocus && {borderColor: 'blue'}]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={{color: 'black'}}
                  data={inverterBrandDetail}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="label"
                  placeholder={
                    values.inverterBrand ? values.inverterBrand : 'Select item'
                  }
                  searchPlaceholder="Search..."
                  onChange={item => {
                    setFieldValue('inverterBrand', item.label);
                  }}
                />

                <Text style={styles.inputLable}>Inverter Capacity</Text>

                <Dropdown
                  style={[styles.inputText, isFocus && {borderColor: 'blue'}]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={{color: 'black'}}
                  data={[
                    {label: '3.2'},
                    {label: '4.0'},
                    {label: '4.2'},
                    {label: '4.6'},
                    {label: '5.0'},
                    {label: '5.4'},
                    {label: '6.0'},
                    {label: '7.0'},
                    {label: '8.0'},
                    {label: '10.0'},
                  ]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="label"
                  placeholder={
                    values.inverterCapacity
                      ? values.inverterCapacity
                      : 'Select item'
                  }
                  searchPlaceholder="Search..."
                  onChange={item => {
                    setFieldValue('inverterCapacity', item.label);
                  }}
                />

                <Text style={styles.inputLable}>Inverter Charges</Text>

                <TextInput
                  name="inverterCharges"
                  placeholder="0"
                  placeholderTextColor={'gray'}
                  value={values.inverterCharges}
                  onChangeText={handleChange('inverterCharges')}
                  onBlur={handleBlur('inverterCharges')}
                  style={styles.inputText}
                  keyboardType="number-pad"
                />
                <Text style={styles.inputLable}>Current Phase</Text>

                <Dropdown
                  style={[styles.inputText, isFocus && {borderColor: 'blue'}]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={{color: 'black'}}
                  data={[{label: '1'}, {label: '3'}]}
                  search
                  maxHeight={300}
                  labelField="label"
                  valueField="label"
                  placeholder={
                    values.noOfPhase ? values.noOfPhase : 'Select item'
                  }
                  searchPlaceholder="Search..."
                  onChange={item => {
                    setFieldValue('noOfPhase', item.label);
                  }}
                />
                <Text style={styles.inputLable}>Meter Charge</Text>

                <TextInput
                  name="meterCharges"
                  placeholder="0"
                  placeholderTextColor={'gray'}
                  value={values.meterCharges}
                  onChangeText={handleChange('meterCharges')}
                  onBlur={handleBlur('meterCharges')}
                  style={styles.inputText}
                  keyboardType="number-pad"
                />

                <Text style={styles.inputLable}>Structure Charges</Text>

                <TextInput
                  name="structureCharges"
                  placeholder="0"
                  placeholderTextColor={'gray'}
                  value={values.structureCharges}
                  onChangeText={handleChange('structureCharges')}
                  onBlur={handleBlur('structureCharges')}
                  style={styles.inputText}
                  keyboardType="number-pad"
                />

                <Text style={styles.inputLable}>GST %</Text>

                <TextInput
                  name="gstPercent"
                  placeholder="0"
                  placeholderTextColor={'gray'}
                  value={values.gstPercent}
                  onChangeText={handleChange('gstPercent')}
                  onBlur={handleBlur('gstPercent')}
                  style={styles.inputText}
                  keyboardType="number-pad"
                />

                <View style={{marginBottom: 20}}>
                  <CsButton
                    name={'Create PDF'}
                    color="#d268cc"
                    onClick={handleSubmit}
                  />
                </View>
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },

  button: {
    padding: 16,
    backgroundColor: '#E9EBED',
    borderColor: '#f4f5f6',
    borderWidth: 1,
  },
  inputLable: {
    color: '#000',
    fontSize: 16,
  },
  inputText: {
    height: 40,
    borderWidth: StyleSheet.hairlineWidth,
    width: '80%',
    borderRadius: 5,
    borderColor: 'black',
    marginVertical: 10,
    fontSize: 16,
    color: 'black',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black',
    paddingHorizontal: 4,
  },
  selectedTextStyle: {
    color: 'black',
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
});
