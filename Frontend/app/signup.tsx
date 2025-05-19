import { StyleSheet, TextInput, Text, View } from 'react-native'
import React from 'react'
import { Link, Stack } from 'expo-router'
import { Colors } from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import InputField from '@/components/InputField'
import { TouchableOpacity } from 'react-native';


type Props = {}

const SignUpScreen = (props: Props) => {
  return (
      <>
        <Stack.Screen options={{headerTitle: 'Sign Up'}} />
        <View style={styles.container}>
          <Text style={styles.title}>Create an Account</Text>
          <InputField
              placeholder="Email Address"
              placeholderTextColor={Colors.gray}
              autoCapitalize="none"
              keyboardType="email-address"
          />
          <InputField
            placeholder="Password"
            placeholderTextColor={Colors.gray}
            secureTextEntry={true}
          />
          <InputField
              placeholder="Confirm Password"
              placeholderTextColor={Colors.gray}
              secureTextEntry={true}
            />

            <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnTxt}>Create an Account</Text>
            </TouchableOpacity>

            <Text style={styles.loginTxt}>
                Already have an account? {" "}
                <Link href={"/signin"} asChild>
                  <TouchableOpacity>
                    <Text style={styles.loginTxtSpan}>Sign In</Text>
                  </TouchableOpacity>
                </Link>
            </Text>
        </View>
      </>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.background
  },
  title: {
      fontSize: 24,
      fontWeight: '600',
      letterSpacing: 1.2,
      color: Colors.black,
      marginBottom: 50
  },
  btn:{
      backgroundColor:Colors.primary,
      paddingVertical: 14,
      paddingHorizontal:18,
      alignSelf:'stretch',
      alignItems: 'center',
      borderRadius: 5,
      marginBottom: 20
  },
  btnTxt:{
      color: Colors.white,
      fontSize: 16,
      fontWeight: '600'
  },
  loginTxt:{
        marginTop: 30,
        color: Colors.black,
        fontSize: 14,
        lineHeight: 24
  },
  loginTxtSpan: {
    color: Colors.primary,
    fontWeight: '600'
  }

});