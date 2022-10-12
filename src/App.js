import React, { useState, useCallback } from 'react';
import 'tachyons';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';

const App = () => {
  const [input, setIput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({})

  const particlesInit = useCallback(async (engine) => {
    console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

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
    const image = document.getElementById('inputImage');
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

  const options = {
    "fullScreen": {
      "enable": true,
      "zIndex": -1
    },
    "particles": {
      "number": {
        "value": 10,
        "density": {
          "enable": false,
          "value_area": 800
        }
      },
      "color": {
        "value": "#fff"
      },
      "shape": {
        "type": "dot",
        "options": {
          "sides": 9
        }
      },
      "opacity": {
        "value": 0.2,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 2,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 50,
          "size_min": 0.1,
          "sync": false
        }
      },
      "rotate": {
        "value": 0,
        "random": true,
        "direction": "clockwise",
        "animation": {
          "enable": true,
          "speed": 5,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 600,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 2
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "events": {
        "onhover": {
          "enable": true,
          "mode": ["grab"]
        },
        "onclick": {
          "enable": false,
          "mode": "bubble"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 200,
          "line_linked": {
            "opacity": .7
          }
        },
        "bubble": {
          "distance": 400,
          "size": 100,
          "duration": 2,
          "opacity": .6,
          "speed": 2
        },
        "repulse": {
          "distance": 50
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true,
  }

  return (
    <div className='App pa2'>
      <Particles
        params={options}
        id='tsparticles'
        init={particlesInit}
        loaded={particlesLoaded}
      />
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
