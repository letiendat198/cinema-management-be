import mongoose,{Schema,model} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters"],
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        default: "user"
    },
     history:[{type:mongoose.Schema.Types.ObjectId, ref:"Order"}],
     userRank:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rank"
    },
     watchHistory:[{
        movie:{type:mongoose.Schema.Types.ObjectId, ref:"Movie",required:true},
        date:{type:Date,default:Date.now}
     }],
     email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        validate:{
            validator:(v)=>{
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)
            },
            message:"Check ur email format"
        }
     }
})
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
})
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}
export const User = mongoose.model.User || model("User", userSchema);