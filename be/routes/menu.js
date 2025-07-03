import express from "express"
import mongoose from "mongoose";
import Restaurant from "../models/Restaurant.js";

const router = express.Router({mergeParams:true});

/*
1. Get whole menu: get "/"
2. Post to menu : post "/"
3. Delete a item : delete "/:id"
4. Update a item : patch "/:id"
*/

router.use((req,res,next)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.Rid)) return res.status(404).send("Invalid Restaurant ID!");
    next();
})

router.get("/", async (req,res)=>{

    const Rid = req.params.Rid;
    const data = await Restaurant.findById(Rid);
    if (!data) return res.status(404).send("Restaurant not found");
    
    res.send(data.menu);
})

router.post("/", async (req,res)=>{
    
    const Rid = req.params.Rid;
    const data = await Restaurant.findById(Rid);
    if (!data) return res.status(404).send("Restaurant not found");
    const {item} = req.body;

    if(!item) return res.status(404).send("Item not found");

    data.menu.push(item);
    await data.save();
    res.send(data.menu);
    
})

router.patch("/:id", async(req,res)=>{
    
    const Rid = req.params.Rid;
    const data = await Restaurant.findById(Rid);
    if (!data) return res.status(404).send("Restaurant not found");
    const {item} = req.body;
    const ind = parseInt(req.params.id);
    
    if(!item) return res.status(404).send("Item not found");

    if (ind < 0 || ind >= data.menu.length) return res.status(404).send("Invalid menu item index");

    data.menu[ind] = item;
    await data.save();

    res.send(data.menu);
})

router.delete("/:id", async (req,res)=>{

    const Rid = req.params.Rid;
    const data = await Restaurant.findById(Rid);
    if (!data) return res.status(404).send("Restaurant not found");

    const ind = parseInt(req.params.id);

    if (ind < 0 || ind >= data.menu.length) return res.status(404).send("Invalid menu item index");
    
    data.menu.splice(ind,1);
    await data.save();
    res.send(data.menu);
})

export default router;