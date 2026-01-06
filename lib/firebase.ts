
import { initializeApp } from 'firebase/app';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { connectorConfig } from '@stay-sync/hotel-os';

const firebaseConfig = {
    apiKey: "AIzaSyB7DSM9yaCzHPa0gHYhCEKHSZP2ZMAuQUo",
    authDomain: "staysync-hotelos.firebaseapp.com",
    projectId: "staysync-hotelos",
    storageBucket: "staysync-hotelos.firebasestorage.app",
    messagingSenderId: "1090400761794",
    appId: "1:1090400761794:web:4566048d52a1bce4e1c85b",
    measurementId: "G-RXHPX90D56"
};

const app = initializeApp(firebaseConfig);

export const dc = getDataConnect(app, connectorConfig);

import { getAuth, connectAuthEmulator } from 'firebase/auth';
export const auth = getAuth(app);

// Connect to emulator in dev
// Note: You might want to make this conditional on process.env.NODE_ENV
// But for this session we assume emulator usage.
connectDataConnectEmulator(dc, 'localhost', 9399);
connectAuthEmulator(auth, "http://localhost:9099"); 
