import mongoose,{Schema,model} from 'mongoose'

const movieSchema = new Schema({
  title:{
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  year: Number,
  rating: Number,
  img: String,
  like:{type: Number, default: 0},
  view:{type: Number, default: 0},
  description: String,
  language: [String],
  length: Number,
  director: String,
  moviestars: [String],
  
})
export const Movie = mongoose.model.Movie || model('Movie', movieSchema)
