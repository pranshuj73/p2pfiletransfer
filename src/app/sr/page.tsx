"use client"

import Peer from "peerjs"
import { useEffect, useState } from "react"

export default function Page() {
    const [myPeerId, setMyPeerId] = useState('');
    const [peer, setPeer] = useState<Peer | null>(null);
    const [remotePeerId, setRemotePeerId] = useState('');
    const [connectedid, setConnectedid] = useState(false);
    const digits=generateRandom5DigitNumber().toString();
    const remotepeer = new Peer(digits);
    const [connectingPeerId, setConnectingPeerId] = useState('');
    const [receivedFileURL, setReceivedFileURL] = useState('');
    const [filename, setfilename] = useState('');
    const [disconnected, setdisconnected] = useState(false);

    useEffect(() => {
        if(peer){
        peer.on('connection', (connection) => {
            connection.on('data', (data :any) => {
                if (data.messagess && data.id) {
                    const { messagess, id } = data;
                    alert(messagess.toString());
                    setConnectingPeerId(id);
                }

            });
        });
    }
    }, [peer]);

    useEffect(() => {
        if(peer){
        peer.on('connection', (connection) => {
            connection.on('data', (data :any) => {
                if (data.datas instanceof ArrayBuffer && data.filenames) {
                    const { datas: file, filenames } = data;
                    const blob = new Blob([file], { type: 'application/octet-stream' });
                    const fileURL = URL.createObjectURL(blob);
                    setReceivedFileURL(fileURL);
                    setfilename(filenames);
                    alert("File received")
                }
            });
        });
    }
    }, [peer]);

    const connect = () => {
        const digit=generateRandom5DigitNumber().toString();
        const newPeer = new Peer(digit);

        newPeer.on('open', (id) => {
            setMyPeerId(id);
        });
        setPeer(newPeer);
    }

    function generateRandom5DigitNumber() {
        const min = 10000; // Minimum 5-digit number
        const max = 99999; // Maximum 5-digit number
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNum;
      }

    const disconnect = () => {
        if (peer) {
            peer.destroy();
            setPeer(null);
            setMyPeerId('');
            setdisconnected(true);
            
        }
    };

    const connectToRemotePeer = () => {
        const connection = remotepeer.connect(remotePeerId);
        connection.on('open', () => {
            alert('Connected to remote peer');
            setConnectedid(true);
            const messages = `incoming connection from ${myPeerId}`
            connection.send({ messagess: messages, id: myPeerId });
        });
    };

    const sendFile = async (file: File) => {
        const connection = remotepeer.connect(remotePeerId);
        connection.on('open', () => {
            const filetype = file.name;
            setfilename(filetype);
            // alert(filetype)
            connection.send({ datas: file, filenames: filetype });
            alert('File sent')
        });
    };

    return (
        <div className="bg-black min-h-screen flex items-center justify-center">
            <div className="bg-black  border-black lg:border-white border rounded-lg p-4 text-white md:border-white">
                <div className="flex justify-center mb-4">
                    <h1 className="text-3xl font-bold">P2P File Transfer</h1>
                </div>
                <button
                    className="bg-white text-black font-bold py-2 px-4 rounded-full mb-4"
                    onClick={connect}
                >
                    Connect
                </button>
                {myPeerId && (
                    <div className="mt-4">
                        <p>Your Peer ID: {myPeerId}</p>
                        {receivedFileURL && (
                            <div className="mt-4">
                                <h2>Received File:</h2>
                                <button className="bg-white text-black font-bold py-2 px-4 rounded-full mb-4">
                                    <a
                                        href={receivedFileURL}
                                        download={filename}
                                    >
                                        Download Received File
                                    </a>
                                </button>
                            </div>
                        )}

                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mt-4 rounded"
                            onClick={disconnect}
                        >
                            Disconnect
                        </button>
                    </div>
                )}
                <div className="mt-4">
                    {myPeerId && (
                        <>
                            <label htmlFor="remotepeer">Enter the remote peer</label>
                            <div className="flex">
                                <input
                                    className="border rounded-l py-2 px-4 text-black"
                                    type="text"
                                    id="remotepeer"
                                    value={remotePeerId}
                                    onChange={(e) => setRemotePeerId(e.target.value)}
                                />
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
                                    onClick={connectToRemotePeer}
                                >
                                    Connect
                                </button>
                            </div>
                        </>
                    )}
                    {connectedid && !disconnected  &&(
                        <div className="mt-4">
                            <p>Remote Peer ID: {remotePeerId}</p>
                            <input
                                className="border py-2 px-4 mt-4"
                                type="file"
                                onChange={(e) => {
                                    const file= e.target.files?.[0];
                                    if(file){
                                    sendFile(file);}
                                }}
                            />
                        </div>
                    )}
                    {connectingPeerId && !disconnected && (
                        <div className="mt-4">
                            <p>Connected account: {connectingPeerId}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}