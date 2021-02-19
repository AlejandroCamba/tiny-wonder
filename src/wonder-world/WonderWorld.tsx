import React, { ReactPropTypes } from 'react';
import { WonderWorldController } from './controllers/wonder-world.controller';
import { Socket } from 'socket.io-client';

type WonderWorldProps = {
    socket: Socket;
    myID: string | undefined;
    users: any[] | undefined;
};

export class WonderWorld extends React.Component<WonderWorldProps> {
    constructor(props: WonderWorldProps) {
        super(props);
    }

    wonderWorldController = new WonderWorldController();
    private isClickPressed = false;

    componentDidMount() {
        this.wonderWorldController.init('canvas');

        this.props.socket.emit(
            'avatar-new-entered',
            this.wonderWorldController.getUser.getAllCoordinates().circle,
            17,
            this.props.myID
        );

        this.props.socket.on('avatar-starting-position', (x: number, y: number, userId: string) => {
            if (!this.wonderWorldController.getRemoteUser(userId)) {
                this.wonderWorldController.addNewRemoteUser(x, y, userId);
                this.props.socket.emit(
                    'avatar-new-entered',
                    this.wonderWorldController.getUser.getAllCoordinates().circle,
                    17,
                    this.props.myID
                );
            }
        });

        this.props.socket.on('user-disconnected', (userId: string) => {
              this.wonderWorldController.removeRemoteUser(userId);
      });
      

        this.props.socket.on('remote-avatar-update', (coordinates: any, userId: string) => {
            this.wonderWorldController.updateRemoteUser(userId, coordinates);
        });

        setInterval(() => {
            this.props.socket.emit(
                'avatar-update',
                17,
                this.wonderWorldController.getUser.getAllCoordinates(),
                this.props.myID
            );
        }, 100);
    }

    handleClick = (e: MouseEvent) => {
        e.stopPropagation();
        this.wonderWorldController.startMovement(
            e.offsetX,
            e.offsetY,
            this.wonderWorldController.getUser
        );
        this.isClickPressed = true;
    };

    handleRelease = (e: MouseEvent) => {
        e.stopPropagation();

        this.wonderWorldController.stopMovement(this.wonderWorldController.getUser);
        this.isClickPressed = false;
    };

    handleMove = (e: MouseEvent) => {
        e.stopPropagation();

        if (this.isClickPressed) {
            this.wonderWorldController.startMovement(
                e.offsetX,
                e.offsetY,
                this.wonderWorldController.getUser
            );
        }

        this.wonderWorldController.updateDirection(
            e.offsetX,
            e.offsetY,
            this.wonderWorldController.getUser
        );
    };

    render() {
        return (
            <div>
                <canvas
                    id='webgl'
                    width='400'
                    height='400'
                    style={{ border: '1px solid' }}
                    onMouseDown={(e) => this.handleClick(e.nativeEvent)}
                    onMouseUp={(e) => this.handleRelease(e.nativeEvent)}
                    onMouseMove={(e) => this.handleMove(e.nativeEvent)}
                ></canvas>
            </div>
        );
    }
}
