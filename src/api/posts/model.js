import { model, Schema } from "mongoose"

const postSection = new Schema(
    {
        text:{type:String, required:true},
         username:{type:String, required:true},
         image:{type:String, required:true},
         users: [{ type: Schema.Types.ObjectId, ref: "User" }],



        },
{
    timestamps:true   

}
)

export default model("posts", postSection)


