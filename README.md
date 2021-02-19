# Tiny Wonder :)

![Tiny Wonder Demo](/readme-docs/demo.gif)

This project was made using React.js, TypeScript, WebGL and WebRTC as an extra effort to get a cool job at Wonder and to get a better feeling of what the guys at Wonder do and get a tiny grasp of the problems they encountered while building it. 

This a very minimal version intended for learning purposes and just so they can see how i work, my learning style and speed.

 It works with any amount of users but for the sake of demosntration i did a short video.

It simulates any amount of users joining directly into a room when initializing the application, no collision detection is needed to start a videoconforence.

# My opinion

There's a lot of things happening from the engineering side of things, it might seem like a screen with some avatars moving around but it's definitely a challenge i want to dive more into, Fast forwarding unit, sockets, peer connections, collision detection (not implemented), among a lot of other things.

I had the knowlodge necessary to do this project and understand almost all theory surounding the technologies used, sockets are not foreign to me, loop rendering either since i've built plenty of games already or the Math concepts like vectors, unitary vectors, among other concepts.

# How to run

1. `npm i`
2. Go to [tiny-wonder-server](https://github.com/AlejandroCamba/tiny-wonder-server) repo, download it or clone it and `npm i` as well.
3. `npm i -g peerjs`
4. Open 3 different terminals and:

#### In terminal 1 (client)
 `npm start`

#### In terminal 2 (server)
 `npm devStart`
 
#### In terminal 3 (peerjs)
`peerjs --port 3001`

go to https://localhost://3000 and open multiple windows

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
