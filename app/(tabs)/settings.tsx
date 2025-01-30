// import React from "react";
// import { NativeBaseProvider, Box, Button, VStack, Text } from "native-base";

// export default function Settings() {
//   return (
//     <NativeBaseProvider>
//       <Box flex={1} bg="gray.100" alignItems="center" justifyContent="center" p={5}>
//         {/* Header */}
//         <Text fontSize="2xl" fontWeight="bold" mb={6}>
//           Settings
//         </Text>

//         {/* Button Group */}
//         <VStack space={4} width="80%">
//           <Button 
//             colorScheme="blue" 
//             size="lg" 
//             borderRadius="full"
//             shadow={3}
//             onPress={() => console.log("Change Password")}
//           >
//             Change Password
//           </Button>

//           <Button 
//             colorScheme="green" 
//             size="lg" 
//             borderRadius="full"
//             shadow={3}
//             onPress={() => console.log("Preferences")}
//           >
//             Preferences
//           </Button>

//           <Button 
//             colorScheme="red" 
//             size="lg" 
//             borderRadius="full"
//             shadow={3}
//             onPress={() => console.log("Logout")}
//           >
//             Logout
//           </Button>
//         </VStack>
//       </Box>
//     </NativeBaseProvider>
//   );
// }


import React from "react";
import { NativeBaseProvider, Box, Button, VStack, Text } from "native-base";

export default function Settings() {
  return (
    <NativeBaseProvider>
      <Box flex={1} bg="black" alignItems="center" justifyContent="center" p={5}>
        {/* Header */}
        <Text fontSize="2xl" fontWeight="bold" color="white" mb={6}>
          Settings
        </Text>

        {/* Buttons with Purple Theme */}
        <VStack space={4} width="80%">
          <Button 
            bg="purple.500" 
            size="lg" 
            borderRadius="full"
            _pressed={{ bg: "purple.600" }}
            _text={{ color: "white", fontWeight: "bold" }}
            onPress={() => console.log("Change Password")}
          >
            Change Password
          </Button>

          <Button 
            bg="purple.500" 
            size="lg" 
            borderRadius="full"
            _pressed={{ bg: "purple.600" }}
            _text={{ color: "white", fontWeight: "bold" }}
            onPress={() => console.log("Preferences")}
          >
            Preferences
          </Button>

          <Button 
            bg="purple.500" 
            size="lg" 
            borderRadius="full"
            _pressed={{ bg: "purple.600" }}
            _text={{ color: "white", fontWeight: "bold" }}
            onPress={() => console.log("Logout")}
          >
            Logout
          </Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
}

