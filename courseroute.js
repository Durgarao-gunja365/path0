const express=require('express');
const router=express.Router();
const Courses=require('../Models/coursemodel');
const csvtojson=require('csvtojson')
const multer=require('multer')
// post
router.post('/',async(req,res)=>{
    try{
const course=new Courses(req.body);
await course.save();
res.status(200).json(course);
    }catch(error){
        res.status(400).json({message:error.message})
    }
});
//get all the data
router.get('/',async(req,res)=>{
    try{
         const course=await Courses.find();
         res.json(course);
    }catch(error){
        res.status(400).json({message:error.message})
    }
})
//cuistomise function
async function getCourses(req,res,next){
    let course;
    try{
        course=await Courses.findById(req.params.id);
        if(course==null){
            return res.status(400).json({message:"record not found"})
        }
    }catch(error){
        return res.status(400).json({message:error.message})
    }
    res.course = course
    next();
}
// get by id
router.get('/:id',getCourses,async(req,res)=>{
await res.json(res.course)
})

//update by id
router.put('/:id',getCourses,async (req,res)=>{
    if(req.body.coursecode!=null){
        res.course.coursecode=  req.body.coursecode;
    }
    if(req.body.coursename!=null){
         res.course.coursename=  req.body.coursename; 
    }
    if(req.body.year!=null){
         res.course.year=  req.body.year;
    }
    try{
        const updateCourse=await res.course.save();
await res.json(updatedCourse)
    }catch(error){
        await res.status(400).json({message:error.message})
    }
})
//delete by id
router.delete('/:id',getCourses,async(req,res)=>{
    try{
        await res.course.deleteOne();
        res.json({message: "course is delete successfully"})
    }catch(error){
        res.status(400).json({message:error.message})  
    } 
})

// bulk uploading
const storage=multer.memoryStorage();
const upload=multer({storag: storage.storag})
router.post('/upload',upload.single('file'),async(req,res)=>{
if(!req.file){
    return res.status(400).json('no file upload');
}
try{
    const jsnarray=await csvtojson().fromString(req.file.buffer.toString());
    await Courses.insertMany(jsnarray);
    res.json({message:"Csv file upload successfully"});
}catch(error){
    return res.status(500).json({error:error.message});
}
})
module.exports=router;
