import { StyleSheet, Text, TextInput, View } from "react-native";
import CsButton from "../components/CustomeButton";
import { Formik } from "formik";

export default function SignUpScreen({ navigation }) {
    return (
        <View style={styles.loginFormContainer}>
            <Formik
                initialValues={{ userName: "", email: "", password: "", confirmPassword: "", phoneNumber: "" }}
                onSubmit={(value) => { console.log(value); }}
            >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <>
                        <Text style={{ color: '#000' }}>UserName</Text>

                        <TextInput
                            name="userName"
                            placeholder="Jams Bond"
                            placeholderTextColor={"gray"}
                            value={values.userName}
                            onChange={handleChange("userName")}
                            onBlur={handleBlur("userName")}
                            style={styles.inputText}
                        />
                        <Text style={{ color: '#000' }}>Email</Text>

                        <TextInput
                            name="email"
                            placeholder="Email@mail.com"
                            placeholderTextColor={"gray"}
                            value={values.email}
                            onChange={handleChange("email")}
                            onBlur={handleBlur("email")}
                            style={styles.inputText}
                        />
                        <Text style={{ color: '#000' }}>Password</Text>

                        <TextInput
                            name="password"
                            placeholder="Abcd@1234"
                            placeholderTextColor={"gray"}
                            value={values.password}
                            onChange={handleChange("password")}
                            onBlur={handleBlur("password")}
                            style={styles.inputText}
                            secureTextEntry
                        />

                        <Text style={{ color: '#000' }}>Confirm Password</Text>

                        <TextInput
                            name="confirmPassword"
                            placeholder="Abcd@1234"
                            placeholderTextColor={"gray"}
                            value={values.confirmPassword}
                            onChange={handleChange("confirmPassword")}
                            onBlur={handleBlur("confirmPassword")}
                            style={styles.inputText}
                            secureTextEntry
                        />


                        <Text style={{ color: '#000' }}>Phone Number</Text>

                        <TextInput
                            name="phoneNumber"
                            placeholder="9xxxxxxxx0"
                            placeholderTextColor={"gray"}
                            value={values.phoneNumber}
                            onChange={handleChange("phoneNumber")}
                            onBlur={handleBlur("phoneNumber")}
                            style={styles.inputText}
                            keyboardType="number-pad"
                        />
                        <CsButton name={"SignUp"} color="#d268cc" onClick={() => { console.log("SignUp is pressed"); }} />
                    </>
                )}
            </Formik>
            <Text>SignUp</Text>
            <View><CsButton name={"Login"} color="#d268cc" onClick={() => navigation.replace('SignIn')} /></View>
        </View>
    )
}

const styles = StyleSheet.create({
    loginFormContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: "center"

    },
    inputText: {
        height: 40,
        borderWidth: StyleSheet.hairlineWidth,
        width: "80%",
        borderRadius: 5,
        borderColor: "black",
        marginVertical: 10,
    },
})