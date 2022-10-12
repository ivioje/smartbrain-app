import './App.css';
import 'tachyons';
import Particles from 'react-tsparticles';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import { useState } from 'react';
import FaceRecognition from './components/faceRecognition/FaceRecognition';

const App = () => {
  const [input, setIput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({})

  const USER_ID = 'ivioje';
  const PAT = '8bd5769ed122489188ea547e12097a67';
  const APP_ID = 'my-first-application';
  const MODEL_ID = 'face-detection';
  const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';
  const IMAGE_URL = input;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  const calculateFaceLocation = (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image =  document.getElementById('inputImage');
   const width = Number(image.width);
   const height = Number(image.height);
   console.log(width, height);
   return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
   }
  }

  const displayFaceBox = (box) => {
    console.log(box);
    setBox(box)
  }

  const onInputChange = (e) => {
    setIput(e.target.value)
  }

  const onButtonSubmit = () => {
    setImageUrl(input)
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.text())
        .then(result => {
          let data = JSON.parse(result);
          displayFaceBox(calculateFaceLocation(data))
          //console.log(data.outputs[0].data.regions[0].region_info.bounding_box);
        })
        .catch(error => console.log('error', error));

  }

  const particleOptions = {
    particles: {
      number: {
        value: 30,
        density: {
          enable: true,
          value_area: 800
        }
      }
    }
  }

  return (
    <div className='App pa2'>
      <Particles className='particles' params={particleOptions} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit}
      />
      <FaceRecognition imageUrl={imageUrl} box={box} />
    </div>
  );
}

export default App;
