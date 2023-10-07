import React, { FunctionComponent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Pokemon from '../models/pokemon';
import formatType from '../helpers/format-type';
import PokemonService from '../services/pokemon-service';



type Props = {
  pokemon: Pokemon,
  isEditForm: boolean
};

// Déclaration du type Field, chaque champ aura une valeur, un message d'erreur potentiel et une propriété indiquand si la valeur et valide ou non
type Field = {
  value?: any,
  error?: string,
  isValid?: boolean
}

// Déclaration du type Form avec la liste des champs dispo
type Form = {
  picture: Field,
  name: Field,
  hp: Field,
  cp: Field,
  types: Field
}


const PokemonForm: FunctionComponent<Props> = ({ pokemon, isEditForm }) => {

  //Déclaration du State qui représente les champs et le données de notre form
  //On initialise la valeur de chaque champs par défaut avec les données reçues en prop
  const [form, setForm] = useState<Form>({
    picture: { value: pokemon.picture},
    name: { value: pokemon.name, isValid: true },
    hp: { value: pokemon.hp, isValid: true },
    cp: { value: pokemon.cp, isValid: true },
    types: { value: pokemon.types, isValid: true },
  });

  const history = useHistory();

  const types: string[] = [
    'Plante', 'Feu', 'Eau', 'Insecte', 'Normal', 'Electrik',
    'Poison', 'Fée', 'Vol', 'Combat', 'Psy'
  ];

  // Permet de savoir si le type passé en paramètre appartient ou non au pokemon
  const hasType = (type: string): boolean => {
    return form.types.value.includes(type);
  }

  //Va réagir à chaque fois qu'un champ est modifié
  const handleInputchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName: string = e.target.name;
    const fieldValue: string = e.target.value;
    const newField: Field = { [fieldName]: { value: fieldValue } };

    // On obtient un nouveau State qui est une copie de l'ancien avec en + les modifications apportées par l'utilisateur sur le champs concerné
    setForm({ ...form, ...newField });
  }

  // 
  const selectType = (type: string, e: React.ChangeEvent<HTMLInputElement>): void => {
    // On récupère un info case cochée ou non depuis l'event reçu en paramètre
    const checked = e.target.checked;
    let newField: Field;

    if (checked) {
      //Si l'utilisateur coche un type, on l'ajoute à la liste des types du pokémon
      const newTypes: string[] = form.types.value.concat([type]); // concat fusionne 2 tablx
      newField = { value: newTypes }; // met a jour
    } else {
      // Si l'utilisateur décoche un type, on le retire de la liste des types du pokémon.
      const newTypes: string[] = form.types.value.filter((currentType: string) => currentType !== type); //filter renvoie un nveau tableau ss le type qui a été décoché
      newField = { value: newTypes }; // met à jour
    }

    setForm({ ...form, ...{ types: newField } });

  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // On bloque le comportement natif du formulaire afin de traiter nous même la sousmission du formulaire
    e.preventDefault();
    const isFormValid = validateForm();

    // Redirection vers page de detail seulement si le form est valid
    if(isFormValid) {
      pokemon.picture = form.picture.value;
      pokemon.name = form.name.value;
      pokemon.hp = form.hp.value;
      pokemon.cp = form.cp.value;
      pokemon.types = form.types.value;
      
      isEditForm ? updatePokemon() : addPokemon();
    }
  }

  const addPokemon = () => {
    PokemonService.addPokemon(pokemon).then(() => history.push('/pokemons'));
  }

  const updatePokemon = () => {
    PokemonService.updatePokemon(pokemon).then(() => history.push(`/pokemons/${pokemon.id}`));
  }

  const isAddform = () => {
    return !isEditForm;
  }

  const validateForm = () => {
    let newForm: Form = form;

    // url Validator
    if(isAddform()){
      const start = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/";
      const end = ".png";

      // Check that url start with start and img are png
      if(!form.picture.value.startsWith(start) || !form.picture.value.endsWith(end)) {
        const errorMsg: string = "L'url n'est pas valide.";
        const newField: Field = { value: form.picture.value, error: errorMsg, isValid: false};
        newForm = {...form, ...{ picture: newField} };
      } else {
        const newField: Field = { value: form.picture.value, error: '', isValid: true};
      }
    }

    // name validator
    // Si le champ est validé, state du form est mis à jour
    if (!/^[a-zA-Zàéè ]{3,25}$/.test(form.name.value)) {
      const errorMsg: string = 'Le nom du pokémon est requis (1-25).';
      const newField: Field = { value: form.name.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ name: newField } };
    } else {
      const newField: Field = { value: form.name.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ name: newField }};
    }

    // hp validator
    // Si le champ est validé, state du form est mis à jour
    if (!/^[0-9]{1,3}$/.test(form.hp.value)) {
      const errorMsg: string = 'Les points de vie du pokémon sont compris entre 0 et 999.';
      const newField: Field = { value: form.hp.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ hp: newField } };
    } else {
      const newField: Field = { value: form.hp.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ hp: newField }};
    }

    // cp validator
    // Si le champ est validé, state du form est mis à jour
    if (!/^[0-9]{1,2}$/.test(form.cp.value)) {
      const errorMsg: string = 'Les dégâts du pokémon sont compris entre 0 et 99.';
      const newField: Field = { value: form.cp.value, error: errorMsg, isValid: false };
      newForm = { ...newForm, ...{ cp: newField } };
    } else {
      const newField: Field = { value: form.cp.value, error: '', isValid: true };
      newForm = { ...newForm, ...{ cp: newField }};
    }

    setForm(newForm);
    return newForm.name.isValid && newForm.hp.isValid && newForm.cp.isValid;
  }

  // Types validator, renvoie un boolean pour savoir si une case à cocher doit être verrouillée ou non
  const isTypesValid = (type: string): boolean => {
    // Si une seule case est selectionnée, empêche de desélectionner cette case
    if(form.types.value.length === 1 && hasType(type)) {
      return false;
    }

    // Si 3 cases sont déjà sélectionnées, empêche d'en sélectionner d'autres
    if(form.types.value.length >= 3 && !hasType(type)) {
      return false;
    }

    return true;
  }

  const deletePokemon = () => {
    PokemonService.deletePokemon(pokemon).then(() => history.push(`/pokemons`));
  }


  return (
    /* On lie l'event onSubmit de soumission du form à notre méthode handleSubmit */
    <form onSubmit={e => handleSubmit(e)}>
      <div className="row">
        <div className="col s12 m8 offset-m2">
          <div className="card hoverable">
            {isEditForm && (
            <div className="card-image">
              <img src={pokemon.picture} alt={pokemon.name} style={{ width: '250px', margin: '0 auto' }} />
              <span className="btn-floating halfway-fab waves-effect waves-light">
                <i onClick={deletePokemon} className="material-icons">delete</i>
              </span>
            </div>
            )}
            <div className="card-stacked">
              <div className="card-content">

                {/* Pokemon picture */}
                {isAddform() && (
                  <div className="form-group">
                  <label htmlFor="picture">Image</label>
                  <input id="picture" name="picture" type="text" className="form-control" value={form.picture.value} onChange={e => handleInputchange(e)}></input>
                  {form.picture.error &&
                  <div className="card-panel red accent-1">
                      {form.name.error}
                  </div>
                  }
                </div>
                )}               

                {/* Pokemon name */}
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input id="name" name="name" type="text" className="form-control" value={form.name.value} onChange={e => handleInputchange(e)}></input>
                  {form.name.error &&
                  <div className="card-panel red accent-1">
                      {form.name.error}
                  </div>
                  }
                </div>

                {/* Pokemon hp */}
                <div className="form-group">
                  <label htmlFor="hp">Point de vie</label>
                  <input id="hp" name="hp" type="number" className="form-control" value={form.hp.value} onChange={e => handleInputchange(e)}></input>
                </div>

                {form.hp.error &&
                  <div className="card-panel red accent-1">
                      {form.hp.error}
                  </div>
                  }

                {/* Pokemon cp */}
                <div className="form-group">
                  <label htmlFor="cp">Dégâts</label>
                  <input id="cp" name="cp" type="number" className="form-control" value={form.cp.value} onChange={e => handleInputchange(e)}></input>
                </div>

                {form.cp.error &&
                  <div className="card-panel red accent-1">
                      {form.cp.error}
                  </div>
                  }
                  
                {/* Pokemon types */}
                <div className="form-group">
                  <label>Types</label>
                  {types.map(type => (
                    <div key={type} style={{ marginBottom: '10px' }}>
                      <label>
                        <input id={type} type="checkbox" className="filled-in" value={type} disabled={!isTypesValid(type)} checked={hasType(type)} onChange={e => selectType(type, e)}></input>
                        <span>
                          <p className={formatType(type)}>{type}</p>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-action center">
                {/* Submit button */}
                <button type="submit" className="btn">Valider</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PokemonForm;