import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import { WonderWorld } from './wonder-world/WonderWorld';
import Peer from 'peerjs';

const ENDPOINT = 'http://localhost:3100/';
const socket = io(ENDPOINT);

const myPeer = new Peer(undefined, {
    host: '/',
    port: 3001,
});

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers: any = {};

export default class App extends React.Component<any, {
        myID?: string;
        users?: { userId: string; x: string; y: string }[];
    }> {
    constructor(props: any) {
        super(props);

        this.state = {
            myID: undefined,
            users: [],
        };
    }

    componentDidMount() {
        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true,
            })
            .then((stream) => {
                this.addVideoStream(myVideo, stream);

                myPeer.on('call', (call) => {
                    call.answer(stream);
                    const video = document.createElement('video');

                    call.on('stream', (userVideoStream) => {
                        this.addVideoStream(video, userVideoStream);
                    });
                });

                socket.on('user-connected', (userId: string) => {
                    this.setState({
                        users: [
                            ...(this.state.users ? this.state.users : []),
                            {
                                userId: userId,
                                x: '',
                                y: '',
                            },
                        ],
                    });

                    this.connectToNewUser(userId, stream);
                });
            });

        socket.on('user-disconnected', (userId: string) => {
            this.setState({
                users: this.state.users?.filter((user) => user.userId !== userId),
            });


            if (peers[userId]) peers[userId].close();
        });

        myPeer.on('open', (id) => {
            this.setState({ myID: id });
            socket.emit('join-room', 17, id);
        });
    }

    render() {
        return (
            <div className='App'>
                <h1>Tiny Wonder</h1>
                { this.state.myID ? <WonderWorld socket={socket} myID={this.state.myID} users={this.state.users} /> : undefined }
                <div id='video-grid'></div>
            </div>
        );
    }

    connectToNewUser(userId: string, stream: MediaStream) {
        const call = myPeer.call(userId, stream);
        const video = document.createElement('video');

        call.on('stream', (userVideoStream) => {
            this.addVideoStream(video, userVideoStream);
        });

        call.on('close', () => {
            video.remove();
        });

        peers[userId] = call
    }

    addVideoStream(video: HTMLVideoElement, stream: MediaStream) {
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });

        document.getElementById('video-grid')?.append(video);
    }
}
