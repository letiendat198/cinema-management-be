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
  bannerImage: String,
  like:{type: Number, default: 0},
  view:{type: Number, default: 0},
  description: String,
  language: [String],
  length: Number,
  director: String,
  moviestars: [String],
  releaseDate: Date,
  ageRating: {
    type: String,
    enum: ['P', 'K', 'T13','T16', 'T18'],
    default: 'P'
  },
  trailer: String
})
export const Movie = mongoose.model.Movie || model('Movie', movieSchema)
