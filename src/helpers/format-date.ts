// Méthode (ou propriété calculée) qui affiche la date correctement pour l'utilisateur
const formatDate = (date:Date = new Date()): string => {
    return`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
                                          // +1 parce que mois 1 = 0
}

export default formatDate; 
