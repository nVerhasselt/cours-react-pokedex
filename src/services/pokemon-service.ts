import Pokemon from "../models/pokemon";
 

export default class PokemonService {
 
// Requêtes

// GET ALL
// Méthode static => pas ratachée aux méthodes de la classe mais à la classe elle-même
  static getPokemons(): Promise<Pokemon[]> {
    return fetch('http://localhost:3001/pokemons')
      .then(response => response.json())
      .catch(error => this.handleError(error));
  }
 
  // GET BY ID
  static getPokemon(id: number): Promise<Pokemon|null> {
    return fetch(`http://localhost:3001/pokemons/${id}`)
      .then(response => response.json())
      .then(data => this.isEmpty(data) ? null : data)
      .catch(error => this.handleError(error));
  }

  // PUT
  static updatePokemon(pokemon: Pokemon): Promise<Pokemon> {
    return fetch(`http://localhost:3001/pokemons/${pokemon.id}`, {
        // Définit le type de la requête
        method:'PUT',
        // Définit le corps de la requête. Encode chaîne de charactères
        body: JSON.stringify(pokemon),
        headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .catch(error => this.handleError(error));
  }

  // DELETE
  static deletePokemon(pokemon: Pokemon): Promise<{}> {
    return fetch(`http://localhost:3001/pokemons/${pokemon.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .catch(error => this.handleError(error));
  }


  // POST
  static addPokemon(pokemon: Pokemon): Promise<{}> {
    delete pokemon.created;
    
    return fetch(`http://localhost:3001/pokemons`, {
      method: 'POST',
      body: JSON.stringify(pokemon),
      headers: { 'Content-Type' : 'application/json'}
  })
    .then(response => response.json())
    .catch(error => this.handleError(error));
  }

  // SEARCH
  static searchPokemon(term: string): Promise<Pokemon[]> {
    return fetch(`http://localhost:3001/pokemons?q=${term}`)
    .then(response => response.json())
    .catch(error => this.handleError(error));
  }
 
  

  static isEmpty(data: Object): boolean {
    return Object.keys(data).length === 0;
  }
  
  static handleError(error: Error): void {
    console.log(error);
  }
}