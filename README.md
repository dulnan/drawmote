# drawmote client

https://drawmote.app

## What is drawmote?
drawmote is a browser app that allows you to use your phone as an input device
to point at and draw on your computer screen. It works by establishing a WebRTC
connection between phone and computer, using the phone's gyroscope to calculate
where the phone is pointing at on the screen and simulating mouse movement to
draw on a canvas.

## How it's built
Some of the things used to build drawmote:

### Frameworks and libraries
- [Vue.js](https://github.com) as the JavaScript framework
- [socketpeer](https://github.com) to establish a WebRTC connection or fallback
  to Websockets
- [gyronorm](https://github.com) for cross-browser reading of a gyroscope

### Custom libraries
During the development of drawmote some important functionality has been
extracted to separate repositories and modules:

| Name | Description | Demo |
| ------------- | ------------- |
| [drawmote-server](https://github.com/dulnan/drawmote-server) | The server used to generate pairing codes and hashes for establishing a WebRTC connection. Acts as a Websockets server as a fallback. | |
| [lazy-brush](https://github.com/dulnan/lazy-brush) | Smooth drawing by pulling the brush with a rope connected to the brush and pointer | [https://dulnan.net/var/lazy-brush](Demo) |
| [catenary-curve](https://github.com/dulnan/catenary-curve) | Calculate and draw a cantary curve on a canvas | [https://dulnan.net/var/catenary-curve](Demo) |
| [gyro-plane](https://github.com/dulnan/gyro-plane) | Using alpha and beta angles from a gyroscope, calculate where its pointing at on a screen | [https://dulnan.net/var/gyro-plane](Demo) |
| TODO: vue-animation-threads | Combine animation loops from multiple components into a single requestAnimationFrame loop and provide a consistent state. | TODO |

### History
The app has been fundamentally changed and refactored several times during
development. It started out as a hacky VanillaJS proof-of-concept, then got
refactored into a OOP-style codebase. After that, a complete rewrite using
Vue.js happened. At first Vuex was used as a way to store and share data.
Pretty soon it was clear that this increases the latency from gyroscope to
canvas draw. So I switched to an event-based approach, with an event bus
notifying components about new orientation data from the gyroscope. That worked
quite well, but was still measurably introducing a lag.

## How low latency was achieved
Until quite late in the project, every component had its own animation loop
using requestAnimationFrame. In total there were 7 loops running at the same
time. The problem was that these loops ran at different speeds, had different
states and sometimes were interfering with each other. The solution was to
completely remove Vuex and manage state manually. A Vue plugin was created that
allows for every component to define an animation function. The plugin takes all
these functions and runs them in a single requestAnimationFrame loop. In
addition it's possible for every component to specify in what case the function
should be called. These are called threads. For example a thread can be named
THREAD_POINT, which then is only run if the pointer coordinates change. Or
THREAD_BRUSH, when the settings of the brush change. This is all done manually;
so when changing the brush opacity the corresponding thread(s) have to be
triggered.

With this approach, the time passing from when new orientation data is received
and when the last draw function has been done, is on average just 8ms, which is
not really noticeable. If phone and desktop are in the same network, the total
delay from when gyroscope values are read out and the brush is moving on the
screen is higher, but still not close to a range where drawing becomes annoying.
Even when both devices are in seprate networks with good network connetions,
it's still useable.

After a few seconds, our brains can compensate easily for the delay introduced
between what the hand is doing and what the eyes are seeing.

## Run locally
You need both the client and
[drawmote-server](https://github.com/dulnan/drawmote-server) to run it locally.

Install dependencies for the client:
```
npm install
```

Start drawmote-server and  set the IP address of the server in `.env.development`.
Then you can start running development mode for the client:
```
npm run serve
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
`
