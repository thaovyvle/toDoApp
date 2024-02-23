import React from 'react'
import { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, FlatList, TouchableOpacity, Button, TextInput, CheckBox } from 'react-native';
import { Text, Input } from '@rneui/themed'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack = createNativeStackNavigator()
const loginData = ([
  {username: "test", password: "Test1@"},
])

export default function App() {
  let [login, setLogin] = useState(loginData)
  useEffect(() => {
    async function getLoginData() {
      const value = await AsyncStorage.getItem("@login")
      if(value === null) {
        console.log("Storing a serialized version of the login data" + JSON.stringify(login))
        await AsyncStorage.setItem('@login', JSON.stringify(login))
      } else {
        console.log("Retrieving a sterilized version of the login data" + value)
        setLogin(JSON.parse(value))
      }
    }
    getLoginData()
  }, [])
  return (
    <NavigationContainer> 
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Todo List" component={TodoScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function WelcomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Welcome</Text>
      <Text style={styles.introText}>Start organizing your to-do lists</Text>
      <Button color="#F9BD58" title="Get Started" onPress={()=> navigation.navigate("Todo List")}/>
    </View>
  );
}

function LoginScreen({navigation}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginMsg, setLoginMsg] = useState(false)

  const checkLogin = (username,password) => {
    const userInput = loginData.map(item => {
      if (item.username === username && item.password === password) {
        setLoginMsg(false)
        navigation.navigate("Todo List")
      } else {
        setLoginMsg(true)
      }
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Login Now</Text>
      <Text style={styles.introText}>Please login to continue our app</Text>
      <View style={styles.loginContainer}>
          <TextInput style={styles.input} placeholder='Username' value={username} onChangeText={text=>setUsername(text)}/>
      </View>
      <View style={styles.loginContainer}>
          <TextInput style={styles.input} placeholder='Password' value={password} secureTextEntry onChangeText={text=>setPassword(text)}/>
      </View>
      {loginMsg? (
        <Text style={styles.errorText}>Invalid Username or Password. Try Again</Text> ) : ( <Text></Text>)
      }
      <View style={styles.buttonContainer}>
        <Button color="#F9BD58" title="Login" onPress={()=> checkLogin(username,password)}/>
      </View>
      <Text style={styles.introText}>Don't have an account?</Text>
      <View style={styles.buttonContainer}>
      <Button color="#00707C" title="Register" onPress={()=> navigation.navigate("Register")}/>
      </View>
    </View>
  );
}

function RegisterScreen({navigation}) {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [username, setUsername] = useState('')
  const [phonenumber, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmpassword] = useState('')
  const [email, setEmail] = useState('')
  const [zip, setZip] = useState('')
  const [isSelected, setSelection] = useState(false);

  // Validate First Name 
  const [checkFName, setCheckFName] = useState(false)

  const handleFName = (e) => {
    let regex = /^[^\d=?\\/@#%^&*()]+$/
    setFirstname(e)
    if (regex.test(e)) {
      setCheckFName(false)
    } else {
      setCheckFName(true)
    }
  }

  // Validate Last Name 
  const [checkLName, setCheckLName] = useState(false)

  const handleLName = (e) => {
    let regex = /^[^\d=?\\/@#%^&*()]+$/
    setLastname(e)
    if (regex.test(e)) {
      setCheckLName(false)
    } else {
      setCheckLName(true)
    }
  }

  // Validate Phone Number
  const [checkPhone, setCheckPhone] = useState(false)
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;

    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }

    setCheckPhone(false)
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3,6)}-${phoneNumber.slice(6, 10)}`;
  }
  const handlePhone = (e) => {
    setCheckPhone(true)
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhone(formattedPhoneNumber);
  };

  // Validate Password 
  const [checkUpper, setCheckUpper] = useState(false)
  const [checkLower, setCheckLower] = useState(false)
  const [checkNum, setCheckNum] = useState(false)
  const [checkNonAlphaNum, setCheckNonAlphaNum] = useState(false)
  const handlePassword = (e) => {
    const containsUppercase = /^(?=.*[A-Z]).*$/
    const containsLowercase = /^(?=.*[a-z]).*$/
    const containsNumber = /^(?=.*[0-9]).*$/
    const containsNonAlphaNum = /^(?=.*[^a-zA-Z0-9]).*$/
    setPassword(e)
    setCheckUpper(true)
    setCheckLower(true)
    setCheckNum(true)
    setCheckNonAlphaNum(true)
    if (containsUppercase.test(e) && containsLowercase.test(e) && containsNumber.test(e) && containsNonAlphaNum.test(e)) {
      setCheckUpper(false)
      setCheckLower(false)
      setCheckNum(false)
      setCheckNonAlphaNum(false)
    } else if (!containsUppercase.test(e) && containsLowercase.test(e) && containsNumber.test(e) && containsNonAlphaNum.test(e)) {
      setCheckUpper(true)
      setCheckLower(false)
      setCheckNum(false)
      setCheckNonAlphaNum(false)
    } else if (containsUppercase.test(e) && !containsLowercase.test(e) && containsNumber.test(e) && containsNonAlphaNum.test(e)) {
      setCheckUpper(false)
      setCheckLower(true)
      setCheckNum(false)
      setCheckNonAlphaNum(false)
    } else if (containsUppercase.test(e) && containsLowercase.test(e) && !containsNumber.test(e) && containsNonAlphaNum.test(e)) {
      setCheckUpper(false)
      setCheckLower(false)
      setCheckNum(true)
      setCheckNonAlphaNum(false)
    } else if (containsUppercase.test(e) && containsLowercase.test(e) && containsNumber.test(e) && !containsNonAlphaNum.test(e)) {
      setCheckUpper(false)
      setCheckLower(false)
      setCheckNum(false)
      setCheckNonAlphaNum(true)
    } 
  }

  // Validate Confirm Password
  const [checkConfirmPass, setCheckConfirmPass] = useState(false)
  const handleConfirmPass = (e) => {
    setConfirmpassword(e)
    if (password === e) {
      setCheckConfirmPass(false)
    } else {
      setCheckConfirmPass(true)
    }
  }

  // Validate Email
  const [checkEmail, setCheckEmail] = useState(false)

  const handleEmail = (e) => {
    let regex = /[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z]/
    setEmail(e)
    if (regex.test(e)) {
      setCheckEmail(false)
    } else {
      setCheckEmail(true)
    }
  }

  // Validate Zip Code
  const [checkZip, setCheckZip] = useState(false)

  const handleZip = (e) => {
    let regex = /^\d{5}$/
    setZip(e)
    if (regex.test(e)) {
      setCheckZip(false)
      checkReg(false)
    } else {
      setCheckZip(true)
    }
  }

  const [reg, checkReg] = useState(true)
  const checkRegistration = () => {
    if (!reg && !checkFName && !checkLName && !checkPhone && !checkUpper && !checkLower && !checkNum && !checkNonAlphaNum && !checkConfirmPass && !checkEmail && !checkZip) {
      addLoginData()
      navigation.navigate("Todo List")
    } 
  }

  const addLoginData = () => {
    const newLogin = {username: username, password: password}
    loginData.push(newLogin)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Register Now</Text>
      {reg? (
        <Text style={styles.regText}>Please Fill Out Entire Form to Continue</Text> ) : ( <Text></Text>)
      }
      <View style={styles.loginContainer}>
          <TextInput style={styles.input} testID="firstname" placeholder='First Name' value={firstname} onChangeText={text=>handleFName(text)}/>
      </View>
      {checkFName? (
        <Text style={styles.errorText}>Error: Can only include letters & symbols, no numbers</Text> ) : ( <Text></Text>)
      }
      <View style={styles.loginContainer}>
          <TextInput style={styles.input} testID="lastname" placeholder='Last Name' value={lastname} onChangeText={text=>handleLName(text)}/>
      </View>
      {checkLName? (
        <Text style={styles.errorText}>Error: Can only include letters & symbols, no numbers</Text> ) : ( <Text></Text>)
      }
      <View style={styles.loginContainer}>
          <TextInput style={styles.input} testID="username" placeholder='Username' value={username} onChangeText={text=>setUsername(text)}/>
      </View>
      <View style={styles.loginContainer}>
          <TextInput style={styles.input} testID="phonenumber" placeholder='Phone Number' value={phonenumber} onChange={text=>handlePhone(text)}/>
      </View>
      {checkPhone? (
        <Text style={styles.errorText}>Error: Must be in (xxx) xxx-xxxx format</Text> ) : ( <Text></Text>)
      }
      <View style={styles.loginContainer}>
          <TextInput style={styles.input} testID="password" placeholder='Password' value={password} secureTextEntry onChangeText={text=>handlePassword(text)}/>
      </View>
      {checkUpper? (
        <Text style={styles.errorText}>Password must have at least one Uppercase Character</Text> ) : ( <Text></Text>)
      }
      {checkLower? (
        <Text style={styles.errorText}>Password must have at least one Lowercase Character</Text> ) : ( <Text></Text>)
      }
      {checkNum? (
        <Text style={styles.errorText}>Password must contain at least one Number</Text> ) : ( <Text></Text>)
      }
      {checkNonAlphaNum? (
        <Text style={styles.errorText}>Password must contain at least one Non-Alpha Numeric Character</Text> ) : ( <Text></Text>)
      }
      <View style={styles.loginContainer}>
          <TextInput style={styles.input} testID="confirmpassword" placeholder='Confirm Password' secureTextEntry value={confirmpassword} onChangeText={text=>handleConfirmPass(text)}/>
      </View>
      {checkConfirmPass? (
        <Text style={styles.errorText}>Does not match password entered</Text> ) : ( <Text></Text>)
      }
      <View style={styles.loginContainer}>
          <TextInput style={styles.input} testID="email" placeholder='Email' value={email} onChangeText={text=>handleEmail(text)}/>
      </View>
      {checkEmail? (
        <Text style={styles.errorText}>Error: Email must contain @ and '.'</Text> ) : ( <Text></Text>)
      }
      <View style={styles.loginContainer}>
          <TextInput style={styles.input} testID="zip" placeholder='ZIP Code' value={zip} onChangeText={text=>handleZip(text)}/>
      </View>
      {checkZip? (
        <Text style={styles.errorText}>Error: Must include 5 digits (US Zip codes)</Text> ) : ( <Text></Text>)
      }
      <View style={styles.checkboxContainer}>
        <Text style={{fontSize: 16}}>Sign Up for Newsletter?</Text>
        <CheckBox value={isSelected} onValueChange={setSelection} style={styles.checkbox}/>
      </View>
      <View style={styles.buttonContainer}>
        <Button color="#F9BD58" title="Register" onPress={()=> checkRegistration()}/>
      </View>
    </View>
  );
}

function DetailsScreen({navigation, route}) {
  let {key, title, completed, time, description} = route.params
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.timeText}>{time}</Text>
      <Text style={styles.detailText}>{description}</Text>
    </View>
  );
}

function TodoScreen( {navigation}) {
  let totalKeys = 5
  const [textInput, setTextInput] = useState('')
  const [tasks, setTask] = useState([
    {key: 1, title: 'Yoga Class', completed: false, time: "Today: 8:00 AM - 9:00 AM", description: "With instructor Michael at Red Sun Yoga"},
    {key: 2, title: 'Meeting', completed: false, time: "Tomorrow: 12:30 PM - 1:30 PM", description: "Discuss with advisor courses to take next semester"},
    {key: 3, title: 'Grocery Shopping', completed: false, time: "Tomorrow: 4:00 PM - 4:45 PM", description: "Eggs, Milk, Bagels, Chicken"},
    {key: 4, title: 'Doctors Appointment', completed: true, time: "Yesterday: 3:30 PM - 4:30 PM",description: "Annual Check-Up with Doctor Phillips"},
    {key: 5, title: 'Dinner with Mom', completed: true, time: "3/20/23: 8:00 PM - 9:30 PM",description: "Dinner at Sixty Vines"}
  ])

  const ListItem = ({ task }) => {
    return (
      <>
        <View style={styles.taskList}>
          <View style={{flex: 1}}>
            <Text 
              style={{ textDecorationLine: task?.completed ?"line-through" : "none", 
              textDecorationStyle: 'solid', 
              textDecorationColor: 'red'}}>
              {task?.title}</Text>
          </View>
          <TouchableOpacity style={styles.checkButton} onPress={()=>markComplete(task?.key)}>
            {task?.completed && (
            <Icon name="done" size={20} color={"#00707C"} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={()=>deleteTask(task?.key)}>
            <Icon name="delete" size={20} color={"#00707C"} />
          </TouchableOpacity>
          <Button color="#00707C" title="Details" onPress={()=> navigation.navigate("Details", task)} />
        </View>
      </>
    )
  }

  const addTask = () => {
    totalKeys = totalKeys + 1
    const newTask = {key: totalKeys, title: textInput, completed: false, }
    setTask([...tasks, newTask])
    setTextInput('')
  }

  const markComplete = taskKey => {
    const newTask = tasks.map(item => {
      if (item.key == taskKey) {
        return {...item, completed: true}
      }
      return item
    })
    setTask(newTask)
  }

  const deleteTask = taskKey => {
    const curTask = tasks.filter(item => item.key != taskKey)
    setTask(curTask)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Todo List</Text>
      <FlatList data={tasks} renderItem={({item}) => <ListItem task={item} />}></FlatList>
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <Input placeholder='Add Task' value={textInput} onChangeText={text=>setTextInput(text)}/>
        </View>
        <TouchableOpacity onPress={addTask}>
          <View style={styles.addButton}>
            <Icon name="add" color={"white"} size={30}/>
          </View>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#abcfd1',
    alignItems: 'center',
    paddingTop: 50,
  },
  titleText: {
    fontSize: 40,
    color: "#00707C",
    fontWeight: 'bold',
    padding: 7
  },
  taskText: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    padding: 20
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    color: "white",
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30
  },
  inputContainer: {
    backgroundColor: "white",
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 10,
    borderRadius: 30,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  addButton: {
    height: 50,
    width: 50,
    backgroundColor: "#00707C",
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  taskList: {
    padding: 20,
    backgroundColor: "white",
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  checkButton: {
    height: 25,
    width: 25,
    backgroundColor: '#FDD98F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    marginLeft: 50
  },
  deleteButton: {
    height: 25,
    width: 25,
    backgroundColor: '#FDD98F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    marginLeft: 5,
    marginRight: 10
  },
  timeText: {
    margin: 15,
    fontWeight: 'bold',
    fontSize: 20
  },
  detailText: {
    fontSize: 18
  },
  introText: {
    fontSize: 18,
    paddingTop:30,
    paddingBottom: 15
  },
  loginContainer: {
    width: '50%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 20
  },
  checkbox: {
    alignSelf: 'center',
    marginLeft: 10
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold'
  },
  regText: {
    fontSize: 13,
    paddingTop:10,
    paddingBottom: 10
  },
});
