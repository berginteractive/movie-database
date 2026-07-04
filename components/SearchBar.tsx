import { icons } from "@/constants/icons";
import React from "react";
import { Image, TextInput, View } from "react-native";

interface Props {
  onPress?: () => void;
  placeholder: string;
}

const SearchBar = ({ onPress, placeholder }: Props) => {
  return (
    <View className="flex-row items-center bg-dark-100 rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#AB8BFF"
      />
      <TextInput
        className="flex-1 ml-2 text-white"
        placeholder={placeholder}
        onPress={onPress}
        onChangeText={() => {}}
        placeholderTextColor="#A8B5DB"
      />
    </View>
  );
};

export default SearchBar;
