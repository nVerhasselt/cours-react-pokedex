import React, {useState, useEffect } from 'react';
import Pokemon from 'C:/Users/ninav/Desktop/cours-react-pokedex/src/models/pokemon';
import PokemonCard from 'C:/Users/ninav/Desktop/cours-react-pokedex/src/components/pokemon-card';
import PokemonService from '../services/pokemon-service';

  
function PokemonList() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  
  useEffect(() => {
    PokemonService.getPokemons().then(pokemons => setPokemons(pokemons));
  }, []);

  


  return (
    <div>
      <h1 className="center">Pokédex</h1>
      <div className="container"> 
        <div className="row"> 
        {pokemons.map(pokemon => (
          <PokemonCard key={pokemon.id} pokemon={pokemon}/>
        ))}
        </div>
      </div>
    </div> 
  );
}
  
export default PokemonList;