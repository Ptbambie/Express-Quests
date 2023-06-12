const argon2 = require("argon2"); //importe la bibliothèque Argon2 qui est utilisée pour le hachage sécurisé des mots de passe.
const jwt = require("jsonwebtoken"); //bibliothèque JWT

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


// vérifie si le mot de passe fourni correspond au mot de passe haché stocké dans l'objet req.user.hashedPassword
const verifyPassword = (req, res) => {
  argon2
    .verify(req.user.hashedPassword, req.body.password)// compare le mot de passe fourni avec le mot de passe haché stocké 
    // Cela renvoie une promesse qui se résout avec un booléen 
    .then((isVerified) => {// vérifie si c'est réussie ou non.
      if (isVerified) {
        //Un objet payload est créé avec le sous-jet identifiant l'utilisateur (req.user.id).
        const payload = { sub: req.user.id };
        //La méthode jwt.sign() est utilisée pour générer un jeton JWT en utilisant le payload, 
        //la clé secrète (process.env.JWT_SECRET) et une option d'expiration de 1 heure.
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        //Le mot de passe haché (req.user.hashedPassword) est supprimé de l'objet req.user pour des raisons de sécurité.
        delete req.user.hashedPassword;
        res.send({ token, user: req.user });
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

//vérification d'un jeton JWT
const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");

    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }

    //La valeur de l'en-tête Authorization est divisée en deux parties : 
    const [type, token] = authorizationHeader.split(" ");
    
   //le type et le jeton. Elle est supposée être au format "Bearer <token>
    if (type !== "Bearer") {//. Si le type n'est pas "Bearer", une erreur est lancée avec le message "Authorization header has not the 'Bearer' type".
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    req.payload = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken, // don't forget to export
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
};

