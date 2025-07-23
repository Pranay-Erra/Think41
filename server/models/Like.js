import mongoose from "mongoose";
const LikeSchema=new mongoose.Schema({
    post_str_id:{type:String,required:true,ref:'Post'},
    user_id_str:{type:String,required:true},
    liked_at:{type:Date,default:Date.now}
});

LikeSchema.index({post_str_id:1,user_id_str:1},
    {unique:true}
);

export default mongoose.model('Like',LikeSchema)