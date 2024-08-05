import jwt from 'jsonwebtoken';

const authRoute = (req,res,next)=>{
    const token = req.header("Authorization");
    if(!token){
        res.json({"message": "token not found "});
    }
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY); 
        req.user = decoded.email;
        //here the student email is decoded from jwt token
        next();
    }catch(err){
        res.json({"error" : "token not verified"}); 
    }
}
export default authRoute;