import { View, Text } from 'react-native';


export default function TabOneScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-xl font-bold text-dark dark:text-white">Home</Text>
      <Text className="text-xs font-mono text-dark dark:text-white mt-4">
        Text with custom font (SpaceMono x NativeWind)
      </Text>
      <View className="h-[1px] w-4/5 my-8 bg-[#eee] dark:bg-zinc-900" />
      <View className="mt-2 mx-5 items-center">
        
      </View>
    </View>
  );
}
