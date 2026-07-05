import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Index = () => {
  const router = useRouter();

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
  } = useFetch(() =>
    fetchMovies({
      query: "",
    }),
  );

  return (
    <View className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" translucent={true} />
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10, minHeight: "100%" }}
      >
        <Image
          source={icons.logo}
          className="w-12 h-10 self-center mt-20 mb-5"
        />
        <View className="flex-1 mt-5">
          <SearchBar
            onPress={() => router.push("/search")}
            placeholder="Search for a movie"
          />
          {moviesLoading ? (
            <ActivityIndicator
              size="large"
              color="#AB8BFF"
              className="mt-10 self-center"
            />
          ) : moviesError ? (
            <View className="mt-10 items-center">
              <Text className="text-white text-center">
                Error: {moviesError?.message}
              </Text>
              <TouchableOpacity
                onPress={() => refetchMovies()}
                className="mt-4 bg-dark-100 px-6 py-3 rounded-full"
              >
                <Text className="text-white font-bold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text className="text-white text-lg mb-3 mt-5 font-bold">
                Latest Movies
              </Text>
              <FlatList
                className="mt-2 pb-32"
                scrollEnabled={false}
                data={movies}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                renderItem={({ item }) => <MovieCard {...item} />}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default Index;
