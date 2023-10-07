import React, {useState, useEffect } from 'react';
import Pokemon from 'C:/Users/ninav/Desktop/cours-react-pokedex/src/models/pokemon';
import PokemonCard from 'C:/Users/ninav/Desktop/cours-react-pokedex/src/components/pokemon-card';
import PokemonService from '../services/pokemon-service';
import {Link} from 'react-router-dom';
import PokemonSearch from '../components/pokemon-search';

  
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
        <PokemonSearch />
        {pokemons.map(pokemon => (
          <PokemonCard key={pokemon.id} pokemon={pokemon}/>
        ))}
        </div>
        <Link className="btn-floating btn-large waves-effect waves-light red z-depth-3" 
        style={{position: "fixed", bottom: "25px", right: "25px"}}
        to="/pokemon/add"
        >
          <i className="material-icons">add</i>
        </Link>
      </div>
    </div> 
  );
}
  
export default PokemonList;