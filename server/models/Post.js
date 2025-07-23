import mongoose from "mongoose"

const PostSchema=new mongoose.Schema({
  post_str_id:{type:String,unique:true,required:true},
  content:{type:String,required:true},
  created_at:{type:Date,default:Date.now}
})

export default mongoose.model('Post',PostSchema)