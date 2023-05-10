
const Joi = require('joi')

const movieSchema = Joi.object({
  title: Joi.string().max(255).required(),
  director: Joi.string().max(255).required(),
  year: Joi.number().integer().min(1800).max(new Date().getFullYear()).required(),
  color: Joi.boolean().required(),
  duration: Joi.number().integer().positive().required(),
})


const validateMovie = (req, res, next) => {
  const { title, director, year, color, duration} = (req.body);

    const { error } = movieSchema.validate(
      { title, director,year, color, duration}
    );
    if (error){
      res.status(422).json({validationErrors: error.details});
    } else {
      next();
    }
};

module.exports = {
  validateMovie,
};