```ts
let formData= new FormData();
formData.append('pictures', img1)
formData.append('pictures', img2)
formData.append('nom', 'Rakoto')

asunc function uploadFiles(){
    try{
        const response= await axios.post('/upload', formData, {
            headers: {
                "Content-type": "multipart/form-data"
            }
        })
    }catch(err){
        if(err.response){ //got response with a status code diff 2XX
            //do something
        }   
        else if(err.request)    //no response
            //do something
        else //something wrong in setting request
    }
}

.then((response)=>{
    ...
})
```