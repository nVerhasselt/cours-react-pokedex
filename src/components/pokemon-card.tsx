import React, { FunctionComponent, useMemo, useState } from 'react';
import Pokemon from '../models/pokemon';
import './pokemon-card.css';
import formatDate from '../helpers/format-date'; 
import formatType from '../helpers/format-type';
import { useHistory } from 'react-router-dom';

/* 
Exemple import hook personnalisé
import { usePokemons } from '../hooks/usePokemons';
*/


type Props = {
  pokemon: Pokemon,
  borderColor?: string
};

/*
Exemple utilisation d'un hook personnalisé
function PokemonList() {
  const pokemons = usePokemons();

  return ( ... );
}

export default App;
 */


const PokemonCard: FunctionComponent<Props> = ({pokemon, borderColor = '#009688'}) => {

  const [color, setColor] = useState<string>();
  const history = useHistory();
  

  const showBorder = () => {
      setColor(borderColor);  
  }

  const hideBorder = () => {
      setColor('#f5f5f5');  //On remet la bordure en gris.
  }
  

  const goToPokemon = (id: number) => {
    history.push(`/pokemons/${id}`);
  }
  


  return (
    <div className="col s6 m4" onClick={() => goToPokemon(pokemon.id)} onMouseEnter={showBorder} onMouseLeave={hideBorder}>
      <div className="card horizontal" style={{borderColor: color }}>
        <div className="card-image"> 
          <img src={pokemon.picture} alt={pokemon.name}/>
        </div>

        <div className="card-stacked">
          <div className="card-content">

            <p>{pokemon.name}</p>

            <p><small>{formatDate(pokemon.created)}</small></p>
            {/*renderList*/}
            {pokemon.types.map(type=>(
              <span key={type} className={formatType(type)}>{type}</span>
            ))}

          </div>
        </div>

      </div> 
    </div>
  );
}
  
export default PokemonCard;
