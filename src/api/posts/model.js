import { model, Schema } from "mongoose"

const postSection = new Schema(
    {
        text:{type:String, required:true},
         username:{type:String, required:true},
         image:{type:String, required:true},
  
    user:{
        name:{type:String, required:true},
        surname:{type:String},
    }  ,
    image:{type:String, required:true},
    authors: [{ type: Schema.Types.ObjectId, ref: "user" }],
},
{
    timestamps:true   

}
)

export default model("posts", postSection)


