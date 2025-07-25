import { StyleSheet, Text, TextInput, View } from "react-native";
import CsButton from "../components/CustomeButton";
import { Formik } from "formik";

export default function BillForm({navigation}) {
    return(
        <View style={styles.loginFormContainer}>
            <Formik 
            initialValues={{email:"",password:""}}
            onSubmit={(value)=>{console.log(value);}}
            >
                {({handleChange, handleBlur, handleSubmit, values})=>(
                    <>
                                <Text style={{color:'#000'}}>Email</Text>

                        <TextInput
                            name="email"
                            placeholder="Email@mail.com"
                            placeholderTextColor={"gray"}
                            value={values.email}
                            onChange={handleChange("email")}
                            onBlur={handleBlur("email")}
                            style={styles.inputText}
                        />
                                    <Text style={{color:'#000'}}>Password</Text>

                        <TextInput
                            name="password"
                            placeholder="Password"
                            placeholderTextColor={"gray"}
                            value={values.password}
                            onChange={handleChange("password")}
                            onBlur={handleBlur("password")}
                            style={styles.inputText}
                            secureTextEntry
                        />
                        <CsButton name={"Login"} color="#d268cc" onClick={()=>{console.log("login is pressed");}} />
                    </>
                )}
            </Formik>
            <View style={{alignItems:"center", marginTop:25}}>
                <Text style={{color:"blue"}}>Already have an Account?</Text>
                <CsButton name={"SignUp"} color="#d268cc" width={100} onClick={()=>navigation.replace('SignUp')}/>
                </View>

        </View>
    )
}

const styles = StyleSheet.create({
    loginFormContainer:{
        flex:1,
        width:'100%',
        alignItems:'center',
        justifyContent:"center",
        backgroundColor:"#E7E8D1"

    },
    inputText:{
        height:40,
        borderWidth:StyleSheet.hairlineWidth,
        width:"80%",
        borderRadius: 5,
        borderColor:"black",
        marginVertical:10,
    },
})