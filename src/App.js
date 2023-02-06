import React, { useState } from 'react';
import 'tachyons';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import SignIn from './components/sign-in/SignIn';
import WebParticles from './components/particles/Particles';
import Register from './components/register/Register';

const initialUserState = {
  id: '',
  name: '',
  email: '',
  entries: 0,
  joined: ''
}

const App = () => {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState(initialUserState)

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

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  const displayFaceBox = (box) => {
    setBox(box)
  }

  const onInputChange = (e) => {
    setInput(e.target.value)
  }

  const onButtonSubmit = (e) => {
    e.preventDefault();
    setImageUrl(input)
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
      .then(response => response.text())
      .then(result => {
        let data = JSON.parse(result);
        if (result) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: user.id })
          })
            .then(response => response.json())
            .then((count) => {
              setUser(Object.assign(user, { entries: count }))
            })
        }
        displayFaceBox(calculateFaceLocation(data))
      })
      .catch(error => error);
  }

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false);
      setInput('');
      setImageUrl('');
      setBox({});
      setRoute('signin');
      setUser(initialUserState);
    } else if (route === 'home') {
      setIsSignedIn(true)
    }
    setRoute(route)
  }

  const loadUsers = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    })
  }

  return (
    <div className='App pa2'>
      <WebParticles />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />

      {route === 'home' ?
        <div>
          <Logo />
          <Rank user={user} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition imageUrl={imageUrl} box={box} />
        </div> :
        (
          route === 'signin'
            ? <SignIn onRouteChange={onRouteChange} loadUser={loadUsers} /> :
            <Register onRouteChange={onRouteChange} loadUser={loadUsers} />
        )
      }
    </div>
  );
}

export default App;