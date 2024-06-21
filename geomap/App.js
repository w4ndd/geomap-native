import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Image } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const App = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState(null);
  const [location, setLocation] = useState({
    coords: {
      latitude: -8.0421654,
      longitude: -34.9514717,
    },
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização atual.');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = async () => {
    const normalizedInput = movieTitle.trim().toLowerCase();
    const acceptedTitle = "Leave the world behind";
    const acceptedPartialTitle = "Leave the";
    
    if (normalizedInput !== acceptedTitle && !normalizedInput.startsWith(acceptedPartialTitle)) {
      Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      return;
    }

    try {
      const apiKey = 'ec77865b';
      const apiUrl = `https://www.omdbapi.com/?i=tt3896198&apikey=ec77865b`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovieData(data);
      } else {
        Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Houve um problema na busca do filme. Tente novamente mais tarde.');
    }
  };

  return (
    <View>
      <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>Busca de Filmes</Text>
      <TextInput
        style={{ borderWidth: 1, margin: 10, padding: 8 }}
        placeholder="Digite o nome do filme"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      <Button title="Buscar Filme" onPress={handleSearch} />
      {location && (
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Sua localização:</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
          <MapView
            style={{ width: '100%', height: 200 }}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Sua localização"
            />
          </MapView>
        </View>
      )}
      {movieData && (
        <View style={{ margin: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{movieData.Title}</Text>
          <Image
            source={{ uri: movieData.Poster }}
            style={{ width: 100, height: 150 }}
          />
          <Text>Ano: {movieData.Year}</Text>
          <Text>Gênero: {movieData.Genre}</Text>
          <Text>Diretor: {movieData.Director}</Text>
          <Text>Data de lançamento: {movieData.Released}</Text>
          <Text>Tempo de execução: {movieData.Runtime}</Text>
          <Text>Idioma: {movieData.Language}</Text>
          <Text>País: {movieData.Country}</Text>
          <Text>IMDb: {movieData.imdbRating}</Text>
          <Text>Votos no IMDb: {movieData.imdbVotes}</Text>
          <Text>Bilheteria: {movieData.BoxOffice}</Text>
        </View>
      )}
    </View>
  );
};

export default App;