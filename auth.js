const argon2 = require("argon2"); //importe la bibliothèque Argon2 qui est utilisée pour le hachage sécurisé des mots de passe.


//objet qui définit plusieurs options de hachage
const hashingOptions = {
  type: argon2.argon2id, //pécifie l'algorithme Argon2id qui doit être utilisé
  memoryCost: 2 ** 16, //définit le coût de la mémoire pour le calcul du hachage.  Une valeur plus élevée rendra le calcul plus lent
                       //La valeur du memoryCost est généralement exprimée en kilo-octets (Ko) ou en mégaoctets (Mo) de mémoire. 
                      //Dans l'exemple donné, 2 ** 16 signifie 2 puissance 16, ce qui équivaut à 65536 Ko (ou 64 Mo) de mémoire.
  timeCost: 5,// spécifie le nombre d'itérations du calcul de hachage. Une valeur plus élevée rendra le calcul plus lent mais augmentera la sécurité.
  parallelism: 1,//définit le niveau de parallélisme pour le calcul du hachage
};

const hashPassword = (req, res, next) => {//gére une demande HTTP dans le cadre d'un middleware.
  argon2
    .hash(req.body.password, hashingOptions)//est appelé pour hacher le mot de passe provenant de req.body.password en utilisant les options de hachage définies précédemment.
    .then((hashedPassword) => {//gére la résolution de la promesse renvoyée
      console.log(hashedPassword);

      req.body.hashedPassword = hashedPassword;
      delete req.body.password;
      //  Lorsque le hachage du mot de passe est réussi, le hachage résultant est stocké dans req.body.hashedPassword, 
      //puis le champ password est supprimé de req.body.

      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);// renvoyer une réponse avec le statut HTTP 500  si erreur
    });
};

module.exports = {
  hashPassword,
};

