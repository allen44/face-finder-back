// const {ClarifaiStub} = require("clarifai-nodejs-grpc");
// const grpc = require("@grpc/grpc-js");
const Clarifai = require("clarifai");


// Construct one of the stubs you want to use
// const stub = ClarifaiStub.json();
// const stub = ClarifaiStub.insecureGrpc();

// This will be used by every Clarifai endpoint call.
// const metadata = new grpc.Metadata();
// metadata.set("authorization", "Key " + CLARIFAI_API_KEY);


const handleApiCall = (req, res ) => {
    // console.log('req : ', req)
    // console.log('req.body : ', req.body)
    // const imageUrl = req.body.id;
    // const modelIdKeys = {
    //     generalIdentifier: 'aaa03c23b3724a16a56b629203edc62c',
    //     faceDectector: 'c0c0ac362b03416da06ab3fa36fb58e3'
    // }
    // stub.PostModelOutputs(
    //     {
    //         model_id: modelIdKeys.generalIdentifier,
    //         // version_id: "{THE_MODEL_VERSION_ID}",  // This is optional. Defaults to the latest model version.
    //         inputs: [
    //             {data: {image: {url: imageUrl}}}
    //         ]
    //     },
    //     metadata,
    //     (err, response) => {
    //         console.log('err : \n', err, '\n\\err')
    //         console.log('response : \n', response, '\\ response')
    //         if (err) {
    //             throw new Error(err);
    //         }
    
    //         if (response.status.code !== 10000) {
    //             throw new Error("Post model outputs failed, status: " + response.status.description);
    //         } else { //response.status.code == 10000 
    //             console.log("Received success status: " + response.status.description + "\n" + response.status.details);
    //         }
    
    //         // Since we have one input, one output will exist here.
    //         // const output = response.outputs[0];
    
    //         console.log("Predicted concepts:");
    //         for (const concept of output.data.concepts) {
    //             console.log(concept.name + " " + concept.value);
    //         }
    //     }
    // ).catch( (err) => {
    //     res.json(err)
    //     console.log('err in stub.PostModelOutputs :', err);
    // });
    handleApiCallDeprecated(req, res);
}

const handleApiCallDeprecated = (req, res) => {
    console.log('handleApiCallDeprecated() : ')
    console.log('req.body : ', req.body)
    const app = new Clarifai.App({
        apiKey: process.env.API_CLARIFAI
       });
    const imageUrl = req.body.input;
    app.models
      .predict('c0c0ac362b03416da06ab3fa36fb58e3', imageUrl)
      .then(data => {
        console.log(data);
        res.json(data);
        })
      .catch(err => {
        console.log('err 3: ', err)
          res.status(400).json(err))
      }
}

const handleImage = (req, res, db) => {
    // console.log('image.handleImage() :')
    // console.log('req : ', req)
    // console.log('req.body : ', req.body)
    const { id } = req.body;
    db ('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        console.log('entries', entries[0]);
        res.json(entries[0]);
    })
    .catch(err => {
        console.log('err :', err);
        res.status(400).json('unable to get entries');
    });
}

module.exports = {
    handleImage,
    handleApiCall
}